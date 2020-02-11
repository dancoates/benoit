// @ts-ignore
import {EntityApi} from 'react-enty';
import Schema from './Schema';
import {ipcRenderer} from 'electron';
import electron from 'electron';
import {Observable} from 'rxjs';
const {dialog} = electron.remote;
import uuid from 'uuid/v4';

const requestFile = () => {

    return new Observable((subscriber) => {
        (async () => {
            const openResult = await dialog.showOpenDialog({
                filters: [{name: 'csv', extensions: ['csv']}],
                properties: ['openFile', 'multiSelections']
            });
            if(openResult.canceled) {
                subscriber.complete();
                return;
            }

            const {filePaths} = openResult;
            const files = filePaths.map(path => ({
                id: uuid(),
                path
            }));

            ipcRenderer.send('addFiles', {files});

            ipcRenderer.on('addFilesProgress', (event, arg) => {
                console.log(arg);
            });


        })();
    });


}


const api = EntityApi({
    addFile: () => requestFile(),
    tabList: async (payload: any) => ({tabList: await ipcRenderer.invoke('tabList')}),
    dataTableList: async (payload: any) => console.log('dataTableList', payload)

}, Schema);


export default api;
