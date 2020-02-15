import React, {FunctionComponent} from 'react';
import styled from 'styled-components';

type TabItem = {
    id: string,
    name: string,
    activeView: string | null,
    query: string | null,
    variables: string | null
};

type Props = {
    tabList: TabItem[],
    activeTab: string,
    onSelectTab: (tabId: string) => void
};

const TabBar = styled.div`
    width: 100%;
    height: 30px;
    background: grey;
    display: flex;
`;

interface TabProps {
    readonly active: boolean;
}

const Tab = styled.div<TabProps>`
    flex: 1;
    padding: 5px;
    ${props => props.active && `background: #333`}
`;

// @todo move state handling to parent
const Tabs: FunctionComponent<Props> = (props) => {
    const {tabList, onSelectTab, activeTab} = props;

    return <TabBar>
        {tabList.map((tab) => {
            return <Tab
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                active={tab.id === activeTab}
            >
                {tab.name}
            </Tab>;
        })}
    </TabBar>;


};

export default Tabs;