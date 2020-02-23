import React, {FunctionComponent} from 'react';
import styled from 'styled-components';

interface DataTable {
    id: string,
    name: string,
    fileName: string,
    status: string,
    progress: number,
    query: string | null,
    variables: string | null
};

interface Props {
    onAddNewFile: () => void,
    onSelectTable: (id: string) => void,
    tableList: DataTable[],
    activeView: string
};

const SidebarWrapper = styled.div`
    overflow-x: hidden;
    overflow-y: auto;
    width: 100%;
    height: 100%;
`;

const AddFile = styled.button`
    display: block;
    width: 100%;
    padding: 15px;
    border: none;
    outline: none;
    background: transparent;
    color: white;
    font-family: Menlo, Monaco, monospaced;

    &:hover {
        cursor: pointer;
        background: #222;
    }
`;

const TableItem = styled.div<{status: string, progress: number, isActive: boolean}>`
    padding: 10px 15px;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 12px;
    border-bottom: 2px solid #222;
    position: relative;
    ${props => props.isActive && 'background: #222;'}
    &:hover {
        cursor: pointer;
        background: #222;
    }

    &:before {
        content: " ";
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        ${props => props.status === 'IMPORTING' && `width: ${props.progress}%;`}
        background: blue;
        z-index: 1;
    }

    span {
        position: relative;
        z-index: 2;
    }
`;


const Sidebar: FunctionComponent<Props> = (props) => {
    return <SidebarWrapper>
        <AddFile onClick={() => props.onAddNewFile()}>Add File</AddFile>
        <TableItem
            key={'SQL_QUERY'}
            isActive={props.activeView === 'SQL_QUERY'}
            onClick={() => props.onSelectTable('SQL_QUERY')}
            status={'COMPLETE'}
            progress={100}
        >
            <span>SQL Query</span>
        </TableItem>
        {
            props.tableList.map(table => {
                return <TableItem
                    key={table.id}
                    isActive={props.activeView === table.id}
                    onClick={() => props.onSelectTable(table.id)}
                    status={table.status}
                    progress={table.progress}
                >
                    <span title={table.fileName}>{table.name}</span>
                </TableItem>
            })
        }
    </SidebarWrapper>;
};

export default Sidebar;