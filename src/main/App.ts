import electron from 'electron';
import path from 'path';
import Database from 'better-sqlite3';
import uuid from 'uuid/v4';

const appDbTables = {
    tabs: 'CREATE TABLE tabs (id TEXT, name TEXT, active_view TEXT, query TEXT, variables TEXT)',
    data_tables: 'CREATE TABLE data_tables (id TEXT, table_name TEXT, file_name TEXT)'
};


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
}