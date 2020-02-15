
import React from 'react';
import {useState} from 'react';
// @ts-ignore
import {useAutoRequest} from 'react-enty';
import Api from './data/Api';
import VerticalSplit from './components/VerticalSplit';
import HorizontalSplit from './components/HorizontalSplit';
import Loader from './components/Loader';
import Tabs from './layout/Tabs';


export default function() {
    const tabsMessage = Api.tabList.useRequest();
    // const addFileMessage = Api.addFile.useRequest();

    useAutoRequest(() => tabsMessage.onRequest());

    const [activeTabId, setActiveTab] = useState<string | null>(null);

    return <Loader
        message={tabsMessage}
    >{(data) => {

        return <div>
            <Tabs
                tabList={data.tabList}
                activeTab={activeTabId || data.tabList[0].id}
                onSelectTab={(id) => setActiveTab(id)}
            />
            <VerticalSplit
                minSize={50}
                maxSize={300}
                defaultSize={100}
            >
                <div>Item 1f</div>
                <HorizontalSplit>
                    <div>Item 2</div>
                    <div>Item 3</div>
                </HorizontalSplit>

            </VerticalSplit>
        </div>;
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