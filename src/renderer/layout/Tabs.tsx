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
    background: #333;
    display: flex;
    font-size: 12px;
    border-bottom: 1px solid #333;
`;

interface TabProps {
    readonly active: boolean;
}

const Tab = styled.div<TabProps>`
    flex: 1;
    padding: 10px 15px;
    border-left: 2px solid black;
    &:hover {
        cursor: pointer;
        background: #444;
    }

    ${props => props.active && `
        background: black;
        &:hover {
            background: black;
        }
    `}
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