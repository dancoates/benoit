import electron from 'electron';
import path from 'path';
import Database from 'better-sqlite3';

export default class App {
    userDataPath: string;
    static version = 1;
    appDb: Database.Database;
    constructor() {
        this.userDataPath = electron.app.getPath('userData');
        const dbPath = path.resolve(this.userDataPath, `appDb_v${App.version}.db`);
        this.appDb = new Database(dbPath);

        const tables = this.appDb.prepare(`SELECT name FROM sqlite_master WHERE type='table';`).all();
        console.log(tables, 'test');

    }
}