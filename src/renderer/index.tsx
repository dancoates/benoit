import App from './App';
import ReactDom from 'react-dom';
import React from 'react';

import {createGlobalStyle} from 'styled-components';

const GlobalStyle = createGlobalStyle`
    body, html {
        margin: 0;
        padding: 0;
        background: black;
        font-family: Menlo, Monaco, monospaced;
        color: white;
    }
`;

console.log(React.version, ReactDom.version);

ReactDom.render(<React.Fragment>
    <App/>
    <GlobalStyle/>
</React.Fragment>, document.getElementById('app'));