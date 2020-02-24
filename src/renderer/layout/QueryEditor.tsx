import React, {FunctionComponent} from 'react';
import styled from 'styled-components';
import MonacoEditor from 'react-monaco-editor';
import {useState} from 'react';

interface Props {
    runQuery: (query: string) => void
};

const EditorWrapper = styled.div`
    width: 100%;
    height: 100%;
`;



const QueryEditor: FunctionComponent<Props> = (props) => {
    const [value, updateValue] = useState('');
    const options = {
        selectOnLineNumbers: true
    };

    return <EditorWrapper>
        <MonacoEditor
            language={'sql'}
            value={value}
            theme="vs-dark"
            options={options}
            onChange={(newValue) => updateValue(newValue)}
        >
        </MonacoEditor>
        <button onClick={() => props.runQuery(value)}>RUN</button>
    </EditorWrapper>;
};

export default QueryEditor;