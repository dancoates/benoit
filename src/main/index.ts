import electron from 'electron';
import { format as formatUrl } from 'url'
import path from 'path'
import App from './App';

const isDevelopment = process.env.NODE_ENV !== 'production'

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow: Electron.BrowserWindow | null;

const createWindow = () => {
    // Create the browser window.
    mainWindow = new electron.BrowserWindow({
        height: 600,
        width: 800,
        webPreferences: {
            nodeIntegration: true
        }
    });


    if (isDevelopment || true) {
      mainWindow.webContents.openDevTools()
    }

    if (isDevelopment) {
      mainWindow.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`)
    }
    else {
      mainWindow.loadURL(formatUrl({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file',
        slashes: true
      }))
    }


    // Emitted when the window is closed.
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
};

// const bindEvents = (app: App) => {

// }

electron.app.on('ready', () => {
    createWindow();
    const app = new App();
    console.log(app);
    // bindEvents(app);
});

electron.app.on('window-all-closed', () => {
    // Don't quit on mac
    if (process.platform !== 'darwin') {
        electron.app.quit();
    }
});

electron.app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});