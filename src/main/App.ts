import electron from 'electron';
import path from 'path';
import Database from 'better-sqlite3';
import uuid from 'uuid/v4';
import csv from 'csv-parser';
import highland from 'highland';
import fs from 'fs';
import util from 'util';

const fsStat = util.promisify(fs.stat);

const appDbTables = {
    tabs: 'CREATE TABLE tabs (id TEXT, name TEXT, active_view TEXT, query TEXT, variables TEXT)',
    data_tables: 'CREATE TABLE data_tables (id TEXT, table_name TEXT, file_name TEXT)'
};

interface File {
    id: string,
    path: string
}

interface AddFileStatus {
    fileId: string,
    status: string,
    processedSize: number,
    tableName: string,
    tableId: string,
    totalSize: number,
    chunkLength: number | null,
    chunkDuration: number | null
}

interface CsvRow {
    [key: string]: string
}

type AddFileCallback = (err: null | Error, status: AddFileStatus) => void;



export default class App {
    static version = 1;

    appDb: Database.Database;
    dataDbWriter: Database.Database;
    dataDbReader: Database.Database;


    constructor() {
        const userDataPath = electron.app.getPath('userData');
        const appDbPath = path.resolve(userDataPath, `appDb_v${App.version}.db`);
        const dataDbPath = path.resolve(userDataPath, `dataDb_v${App.version}.db`);
        this.appDb = new Database(appDbPath);
        this.dataDbWriter = new Database(dataDbPath);
        this.dataDbReader = new Database(dataDbPath, {readonly: true});
        this.initAppDb();
    }

    get dataTables(): string[] {
        return this.dataDbReader.prepare(`SELECT name FROM sqlite_master WHERE type='table';`)
            .all()
            .map(ii => ii.name);
    }

    initAppDb() {
        const existingTables = this.appDb.prepare(`SELECT name FROM sqlite_master WHERE type='table';`)
            .all()
            .map(ii => ii.name);

        Object.entries(appDbTables).forEach(([tableName, query]) => {
            if(existingTables.includes(tableName)) return;
            this.appDb.prepare(query).run();
        });

        const tabs = this.appDb.prepare('SELECT * from tabs').all();
        // Create first tab if there isn't any
        if(tabs.length === 0) {
            const id = uuid();
            this.appDb.prepare('INSERT INTO tabs (id, name) VALUES (?, ?)').run(id, 'Untitled 1');
        }
    }

    tabList() {
        const tabs = this.appDb.prepare('SELECT id, name, active_view, query, variables from tabs').all();

        return tabs.map(tab => ({
            id: tab.id,
            name: tab.name,
            activeView: tab.active_view,
            query: tab.query,
            variables: tab.variables
        }));
    }

    tableList() {
        const tables = this.appDb.prepare('SELECT id, table_name, file_name from data_tables').all();

        return tables.map(table => ({
            id: table.id,
            name: table.table_name,
            fileName: table.file_name
        }));
    }

    getTableNameFromFile(file: File, incrementor?: number): string {
        const fileName = path.basename(file.path, '.csv');
        const suffix = incrementor ? `_${incrementor}` : '';
        const tableName = fileName.replace(/(\s+)|(-+)/g, '_').replace(/[^A-z0-9_-]/g, '') + suffix;
        if(this.dataTables.map(ii => ii.toLowerCase()).includes(tableName.toLowerCase())) {
            return this.getTableNameFromFile(file, (incrementor || 0) + 1);
        }
        return tableName;
    }

    async updateActiveView({tableId, tabId}) {
        this.appDb.prepare('UPDATE TABS SET active_view = ? WHERE id = ?').run(tableId, tabId);
    }

    // @TODO handle number columns
    // @TODO handle two columns with same safe name
    // @TODO error handling
    async addSingleFile(file: File, callback: AddFileCallback) {
        const maxVariables = 999;
        const callbackThrottle = 350;
        let processedSize = 0;
        let lastCallbackTime = 0;
        let totalSize = await fsStat(file.path).then(stats => stats.size);

        let preparedStatement: {
            statement: Database.Statement,
            rowCount: number
        } | undefined;
        let tableCreated = false;
        let columns: {safeName: string, originalName: string}[] | undefined;
        let insertChunkSize: number | undefined;

        const tableName = this.getTableNameFromFile(file);
        const tableId = uuid();
        let chunk: CsvRow[] = [];
        let start = Date.now();

        const insertChunk = () => {

            if(!columns) return;
            if(!preparedStatement || preparedStatement.rowCount != chunk.length) {
                preparedStatement = {
                    statement: this.dataDbWriter.prepare(`
                        INSERT INTO "${tableName}" (${columns.map(col => '"' + col.safeName + '"').join(', ')})
                        VALUES ${new Array(chunk.length).fill(`(${new Array(columns.length).fill('?').join(', ')})`).join(', ')}
                    `),
                    rowCount: chunk.length
                };
            }

            let values = [];
            for (const row of chunk) {
                for(const column of columns) {
                    values.push(row[column.originalName]);
                }
            }

            preparedStatement.statement.run(values);
            const chunkSize = Buffer.byteLength(
                chunk.map(ii => Object.values(ii).join(',')).join('\n'),
                'utf8'
            );

            processedSize += chunkSize;
            const now = Date.now();

            if(now - lastCallbackTime > callbackThrottle) {
                lastCallbackTime = now;
                callback(null, {
                    fileId: file.id,
                    tableName,
                    tableId,
                    status: 'IMPORTING',
                    processedSize: Math.min(processedSize, totalSize),
                    chunkLength: chunk.length,
                    chunkDuration: now - start,
                    totalSize
                });
            }

            chunk = [];
            start = now;
        };

        highland<CsvRow>(
            fs.createReadStream(file.path)
                .pipe(csv())
        )
        .each((row: CsvRow) => {

            columns = columns || Object.keys(row).map(column => ({
                safeName: column.replace(/(\s+)|(-+)/g, '_').replace(/[^A-z0-9_]/g, ''),
                originalName: column
            }));

            insertChunkSize = insertChunkSize || Math.floor(maxVariables / columns.length);

            // If the table hasn't already been created then do that first
            if(!tableCreated) {

                const fileName = file.path;
                // Save a reference to the table in the app db
                this.appDb.prepare(
                    'INSERT INTO data_tables (id, table_name, file_name) VALUES (?, ?, ?)'
                ).run(tableId, tableName, fileName);

                // create the data table
                this.dataDbWriter.prepare(
                    `CREATE TABLE ${tableName} (${columns.map((col) => `"${col.safeName}" TEXT`).join(', ')})`
                ).run();

                tableCreated = true;
            }

            chunk.push(row);

            if(chunk.length === insertChunkSize) {
                insertChunk();
            }
        })
        .done(() => {
            insertChunk();

            callback(null, {
                fileId: file.id,
                tableName,
                tableId,
                processedSize: totalSize,
                status: 'COMPLETE',
                chunkLength: null,
                chunkDuration: null,
                totalSize
            });
        });
    }

    addFiles(files: File[], callback: AddFileCallback) {
        files.forEach((file) => this.addSingleFile(file, callback));
    }
}