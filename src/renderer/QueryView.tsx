
import React from 'react';
// @ts-ignore
import {useAutoRequest} from 'react-enty';
import Api from './data/Api';

export default function() {
    const tabsMessage = Api.tabList.useRequest();
    const addFile = Api.addFile.useRequest();

    useAutoRequest(() => tabsMessage.onRequest());


    return <div>
        <button onClick={() => addFile.onRequest()}>Add File</button>
        {
            tabsMessage.requestState
                .successMap(() => {
                    console.log(tabsMessage.get('tabList'));
                    return <div>TABS</div>
                })
                .errorMap(() => {
                    return <div>Error getting tabs</div>
                })
                .value()
        }

    </div>;
}