import React, {FunctionComponent} from 'react';
import styled from 'styled-components';

interface DataTable {
    id: string,
    name: string,
    fileName: string,
    query: string | null,
    variables: string | null
};

interface Props {
    onAddNewFile: () => void,
    tableList: DataTable[],
    activeView: string
};

const SidebarWrapper = styled.div`
    overflow: hidden;
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

const TableItem = styled.div`
    padding: 10px 15px;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 12px;
    &:hover {
        cursor: pointer;
        background: #222;
    }
`;


const Sidebar: FunctionComponent<Props> = (props) => {
    // const addFileMessage = Api.addFile.useRequest();

    return <SidebarWrapper>
        <AddFile onClick={() => props.onAddNewFile()}>Add File</AddFile>
        {
            props.tableList.map(table => {
                return <TableItem key={table.id}>
                    <span title={table.fileName}>{table.name}</span>
                </TableItem>
            })
        }
    </SidebarWrapper>;
};

export default Sidebar;