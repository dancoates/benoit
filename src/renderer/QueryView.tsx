
import React from 'react';
// @ts-ignore
import {useAutoRequest} from 'react-enty';
import Api from './data/Api';

export default function() {
    const tabsMessage = Api.tabList.useRequest();
    const addFileMessage = Api.addFile.useRequest();

    useAutoRequest(() => tabsMessage.onRequest());


    return <div>
        <button onClick={() => addFileMessage.onRequest()}>Add File</button>
        {
            tabsMessage.requestState
                .successMap(() => {
                    return <div>TABS</div>
                })
                .errorMap(() => {
                    return <div>Error getting tabs</div>
                })
                .value()
        }

        {
            addFileMessage.requestState
                .successMap(() => {
                    const progress = addFileMessage.get('status');

                    console.log('PROGRESS', progress);
                })
                .value()

        }
    </div>;
}