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

`;

interface TabProps {
    readonly active: boolean;
}

const Tab = styled.div<TabProps>`
    flex: 1;
    padding: 10px 15px;
    border-right: 2px solid black;
    border-bottom: 1px solid #333;
    &:hover {
        cursor: pointer;
        background: #444;
    }

    ${props => props.active && `
        background: black;
        border-bottom: 1px solid black;
        &:hover {
            background: black;
        }
    `}
`;

const NewTab = styled.button`
    width: 50px;
    height: 100%;
    outline: none;
    display: block;
    border: none;
    border-radius: 0;
    font-size: 12px;
    padding: 10px;
    background: black;
    color: white;
    border-left: 1px solid #333;
    &:hover {
        background: #222;
        cursor: pointer;
    }
`;

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
        <NewTab>+</NewTab>
    </TabBar>;
};

export default Tabs;