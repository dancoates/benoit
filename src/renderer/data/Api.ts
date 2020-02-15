// @ts-ignore
import {EntityApi} from 'react-enty';
import Schema from './Schema';
import {ipcRenderer} from 'electron';
import electron from 'electron';
import {Observable} from 'rxjs';
const {dialog} = electron.remote;
import uuid from 'uuid/v4';



interface AddFileStatus {
    fileId: string,
    path: string,
    status: string,
    tableName: string | undefined,
    tableId: string | undefined,
    processedSize: number | undefined,
    totalSize: number | undefined
}

const requestFile = () => {

    return new Observable((subscriber) => {
        (async () => {
            let completeFiles = 0;
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

            const fileIds = files.map(file => file.id);

            let status: AddFileStatus[] = files.map(file => ({
                fileId: file.id,
                path: file.path,
                status: 'UNKNOWN',
                tableName: undefined,
                tableId: undefined,
                totalSize: undefined,
                processedSize: undefined
            }));


            ipcRenderer.send('addFiles', {files});

            ipcRenderer.on('addFilesProgress', (event, addFileStatus: AddFileStatus) => {
                if(fileIds.includes(addFileStatus.fileId)) {
                    status = status.map((file) => {
                        if(file.fileId !== addFileStatus.fileId) return file;
                        return {
                            fileId: file.fileId,
                            path: file.path,
                            status: addFileStatus.status,
                            totalSize: addFileStatus.totalSize,
                            processedSize: addFileStatus.processedSize,
                            tableName: addFileStatus.tableName,
                            tableId: addFileStatus.tableId
                        }
                    });
                    if(addFileStatus.status === 'COMPLETE') completeFiles += 1;
                    subscriber.next({status})

                    if(completeFiles === files.length) {
                        subscriber.complete();
                    }
                }
            });


        })();
    });


}


const api = EntityApi({
    addFile: () => requestFile(),
    appState: async (payload: any) => ({
        dataTableList: await ipcRenderer.invoke('tableList'),
        tabList: await ipcRenderer.invoke('tabList')
    })
}, Schema);


export default api;
