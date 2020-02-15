
import React from 'react';
import {useState} from 'react';
// @ts-ignore
import {useAutoRequest} from 'react-enty';
import Api from './data/Api';
import VerticalSplit from './components/VerticalSplit';
import HorizontalSplit from './components/HorizontalSplit';
import Loader from './components/Loader';
import Tabs from './layout/Tabs';
import Sidebar from './layout/Sidebar';
import styled from 'styled-components';

export default function() {
    const appStateMessage = Api.appState.useRequest();
    const addFileMessage = Api.addFile.useRequest();

    useAutoRequest(() => appStateMessage.onRequest());

    const [activeTabId, setActiveTab] = useState<string | null>(null);

    const Page = styled.div`
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    `;

    // @TODO not sure why this works?
    const handleNewFile = async () => {
        await addFileMessage.onRequest();
        console.log('request app state update');
        await appStateMessage.onRequest();
    };

    return <Loader
        message={appStateMessage}
    >{(data) => {
        const tabId = activeTabId || data.tabList[0].id;
        const activeTab = data.tabList.find(tab => tab.id === tabId);
        const tableList = data.dataTableList;

        return <Page>
            <Tabs
                tabList={data.tabList}
                activeTab={tabId}
                onSelectTab={(id) => setActiveTab(id)}
            />
            <VerticalSplit
                minSize={50}
                maxSize={300}
                defaultSize={100}
            >
                <Sidebar
                    tableList={tableList}
                    activeView={activeTab.activeView}
                    onAddNewFile={() => handleNewFile()}
                />
                <HorizontalSplit>
                    <div>Item 2</div>
                    <div>Item 3</div>
                </HorizontalSplit>

            </VerticalSplit>
        </Page>;
    }}</Loader>;


    // return <div>
    //     <button onClick={() => addFileMessage.onRequest()}>Add File</button>
    //     {
    //         tabsMessage.requestState
    //             .successMap(() => {
    //                 console.log(tabsMessage.get('tabList'))
    //                 return <div>TABS</div>
    //             })
    //             .errorMap(() => {
    //                 return <div>Error getting tabs</div>
    //             })
    //             .value()
    //     }

    //     {
    //         addFileMessage.requestState
    //             .successMap(() => {
    //                 const progress = addFileMessage.get('status');

    //                 console.log('PROGRESS', progress);
    //             })
    //             .value()

    //     }
    // </div>;
}