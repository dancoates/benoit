
import React from 'react';
// import electron from 'electron';
// @ts-ignore
import {useAutoRequest} from 'react-enty';
import Api from './data/Api';

// const {dialog} = electron.remote;

// Figure out best way to request file

export default function() {
    const tabsMessage = Api.tabList.useRequest();

    useAutoRequest(() => tabsMessage.onRequest());


    return <div>
        {
            tabsMessage.requestState
                .successMap(() => {
                    console.log(tabsMessage);
                    return <div>TABS</div>
                })
                .value()

        }

    </div>;
}