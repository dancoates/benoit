import electron from 'electron';
import path from 'path';
import Database from 'better-sqlite3';
import uuid from 'uuid/v4';
import csv from 'csv-parser';
import highland from 'highland';
import fs from 'fs';
import countLines from './util/countLines';

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
    rowsProcessed: number,
    totalRows: number
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
            activeView: tab.activeView,
            query: tab.query,
            variables: tab.variables
        }));
    }

    getTableNameFromFile(file: File, incrementor?: number): string {
        const fileName = path.basename(file.path, '.csv');
        const suffix = incrementor ? `_${incrementor}` : '';
        const tableName = fileName.replace(/(\s+)|(-+)/g, '_').replace(/[^A-z0-9_-]/g, '') + suffix;
        if(this.dataTables.includes(tableName)) {
            return this.getTableNameFromFile(file, (incrementor || 0) + 1);
        }
        return tableName;
    }

    // @TODO handle number columns
    // @TODO sanitise column names
    async addSingleFile(file: File, callback: AddFileCallback) {
        const lineCount = await countLines(file.path);
        let rowsProcessed = 0;

        callback(null, {
            fileId: file.id,
            rowsProcessed,
            totalRows: lineCount
        });

        let preparedStatement: Database.Statement | undefined;
        let tableCreated = false;
        let columns: {safeName: string, originalName: string}[] | undefined;

        const tableName = this.getTableNameFromFile(file);
        const tableId = uuid();

        highland<CsvRow>(
            fs.createReadStream(file.path)
                .pipe(csv())
        )
        .batch(500)
        .each((rows: CsvRow[]) => {

            if(rows.length === 0) return;

            columns = columns || Object.keys(rows[0]).map(column => ({
                safeName: column.replace(/(\s+)|(-+)/g, '_').replace(/[^A-z0-9_]/g, ''),
                originalName: column
            }));

            // If the table hasn't already been created then do that first
            if(!tableCreated) {

                const fileName = file.path;
                // Save a reference to the table in the app db
                this.appDb.prepare(
                    'INSERT INTO data_tables (id, table_name, file_name) VALUES (?, ?, ?)'
                ).run(tableId, tableName, fileName);

                // create the data table
                this.dataDbWriter.prepare(
                    `CREATE TABLE ${tableName} (${columns.map((col) => `${col.safeName} TEXT`).join(', ')})`
                ).run();

                tableCreated = true;
            }

            // Set up prepared statement for fast insert
            if(!preparedStatement) {

                preparedStatement = this.dataDbWriter.prepare(`
                    INSERT INTO ${tableName} (${columns.map(col => col.safeName).join(', ')})
                    VALUES (${columns.map(col => `@${col.safeName}`).join(', ')})
                `);
            }

            for (const row of rows) preparedStatement.run(columns.reduce((rr, col) => ({
                ...rr,
                [col.safeName]: row[col.originalName]
            }), {}));

            rowsProcessed += rows.length;

            callback(null, {
                fileId: file.id,
                rowsProcessed,
                totalRows: lineCount
            });


        });
    }

    addFiles(files: File[], callback: AddFileCallback) {
        files.forEach((file) => this.addSingleFile(file, callback));
    }
}