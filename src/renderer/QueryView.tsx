
import React from 'react';
import {useState} from 'react';
import {useAutoRequest} from 'react-enty';
import Api from './data/Api';
import VerticalSplit from './components/VerticalSplit';
import HorizontalSplit from './components/HorizontalSplit';
import Loader from './components/Loader';
import Tabs from './layout/Tabs';
import Sidebar from './layout/Sidebar';
import QueryEditor from './layout/QueryEditor';
import ResultTable from './layout/ResultTable';
import styled from 'styled-components';
import pipeWith from 'unmutable/pipeWith';
import sortBy from 'unmutable/sortBy';
import get from 'unmutable/get';
import map from 'unmutable/map';
import concat from 'unmutable/concat';
import pipe from 'unmutable/pipe';

const Page = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
`;

const Content = styled.div`
    position: absolute;
    top: 35px;
    left: 0;
    bottom: 0;
    right: 0;
`;

export default function() {
    const appStateMessage = Api.appState.useRequest();
    const addFileMessage = Api.addFile.useRequest();
    const updateActiveViewMessage = Api.updateActiveView.useRequest();

    useAutoRequest(() => appStateMessage.onRequest({foo: 'asddfasdfsadsasdfas'}));

    const [activeTabId, setActiveTab] = useState<string | null>(null);



    const handleNewFile = () => {
        addFileMessage.onRequest();
    };

    const updateActiveView = async (tableId, tabId) => {
        updateActiveViewMessage.onRequest({tableId, tabId});
    };

    const loadingTables = addFileMessage.requestState
        .emptyMap(() => [])
        .fetchingMap(() => [])
        .successMap(() => {
            const status = addFileMessage.get('status');

            return status.map((ii) => ({
                id: ii.fileId,
                name: ii.tableName,
                fileName: ii.path,
                status: ii.status,
                progress: (ii.processedSize / ii.totalSize) * 100
            }));
        }).value();


    return <Loader
        message={appStateMessage}
        // @ts-ignore
    >{(data) => {
        console.log(data);
        const tabId = activeTabId || data.tabList[0].id;
        const activeTab = data.tabList.find(tab => tab.id === tabId);
        const tableList = data.dataTableList;

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
            <Content>

                <VerticalSplit>
                    <Sidebar
                        tableList={mergedTables}
                        activeView={activeTab.activeView}
                        onAddNewFile={() => handleNewFile()}
                        onSelectTable={(tableId) => updateActiveView(tableId, tabId)}
                    />
                    <HorizontalSplit>
                        {activeTab.activeView === 'SQL_QUERY' && <QueryEditor runQuery={() => {}}/>}
                        <ResultTable
                            activeTab={activeTab}
                            tableList={tableList}
                        />
                    </HorizontalSplit>

                </VerticalSplit>

            </Content>
        </Page>;
    }}</Loader>;

}