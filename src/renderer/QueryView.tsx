
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
import pipeWith from 'unmutable/pipeWith';
import sortBy from 'unmutable/sortBy';
import get from 'unmutable/get';
import map from 'unmutable/map';
import concat from 'unmutable/concat';
import pipe from 'unmutable/pipe';

export default function() {
    const appStateMessage = Api.appState.useRequest();
    const addFileMessage = Api.addFile.useRequest();
    // const updateActiveViewMessage = Api.updateActiveView.useRequest();

    useAutoRequest(() => appStateMessage.onRequest({foo: 'asddfasdfsadsasdfas'}));

    const [activeTabId, setActiveTab] = useState<string | null>(null);

    const Page = styled.div`
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    `;

    // @TODO add new files to file list, ensure that there's enough data to include them
    const handleNewFile = () => {
        addFileMessage.onRequest({foo: 'adfsadfsadfsafadfs'});
    };

    // @TODO work out how to update app state when active view changes?
    const updateActiveView = async (tableId, tabId) => {
        // await updateActiveViewMessage.onRequest({tableId, tabId});
    };


    return <Loader
        message={appStateMessage}
    >{(data) => {
        console.log(data);
        const tabId = activeTabId || data.tabList[0].id;
        const activeTab = data.tabList.find(tab => tab.id === tabId);
        const tableList = data.dataTableList;

        const loadingTables = addFileMessage.requestState
            .emptyMap(() => [])
            .fetchingMap(() => [])
            .successMap(() => {
                const status = addFileMessage.get('status');

                console.log('STATUS', status);

                return status.map((ii) => ({
                    id: ii.fileId,
                    name: ii.tableName,
                    fileName: ii.path,
                    status: ii.status,
                    progress: (ii.processedSize / ii.totalSize) * 100
                }));
            }).value();

        const mergedTables = pipeWith(
            tableList,
            map(ii => ({
                ...ii,
                status: 'COMPLETE',
                progress: 100
            })),
            concat(loadingTables),
            sortBy(pipe(get('name'), (name: string) => name.toLowerCase()))
        );

        return <Page>
            <Tabs
                tabList={data.tabList}
                activeTab={tabId}
                onSelectTab={(id) => setActiveTab(id)}
            />
            <VerticalSplit
                minSize={200}
                maxSize={300}
                defaultSize={200}
            >
                <Sidebar
                    tableList={mergedTables}
                    activeView={activeTab.activeView}
                    onAddNewFile={() => handleNewFile()}
                    onSelectTable={(tableId) => updateActiveView(tableId, tabId)}
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