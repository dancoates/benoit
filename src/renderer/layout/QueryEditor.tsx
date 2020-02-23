import React, {FunctionComponent} from 'react';
import styled from 'styled-components';
import MonacoEditor from 'react-monaco-editor';
import {useState} from 'react';

interface Props {

};

const EditorWrapper = styled.div`
    width: 100%;
    height: 100%;
`;



const QueryEditor: FunctionComponent<Props> = (props) => {
    const [value, updateValue] = useState('');


    return <EditorWrapper>
        <MonacoEditor
            language={'sql'}
            value={value}
            onChange={(newValue) => updateValue(newValue)}
        >
        </MonacoEditor>
    </EditorWrapper>;
};

export default QueryEditor;