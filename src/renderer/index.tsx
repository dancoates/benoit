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

    * {
        box-sizing: border-box;
    }


    .splitter-layout {
        position: absolute;
        display: flex;
        flex-direction: row;
        width: 100%;
        height: 100%;
        overflow: hidden;
      }

      .splitter-layout .layout-pane {
        position: relative;
        flex: 0 0 auto;
        overflow: auto;
      }

      .splitter-layout .layout-pane.layout-pane-primary {
        flex: 1 1 auto;
      }

      .splitter-layout > .layout-splitter {
        flex: 0 0 auto;
        width: 4px;
        height: 100%;
        cursor: col-resize;
        background-color: #ccc;
      }

      .splitter-layout .layout-splitter:hover {
        background-color: #bbb;
      }

      .splitter-layout.layout-changing {
        cursor: col-resize;
      }

      .splitter-layout.layout-changing > .layout-splitter {
        background-color: #aaa;
      }

      .splitter-layout.splitter-layout-vertical {
        flex-direction: column;
      }

      .splitter-layout.splitter-layout-vertical.layout-changing {
        cursor: row-resize;
      }

      .splitter-layout.splitter-layout-vertical > .layout-splitter {
        width: 100%;
        height: 4px;
        cursor: row-resize;
      }
`;

console.log(React.version, ReactDom.version);

ReactDom.render(<React.Fragment>
    <App/>
    <GlobalStyle/>
</React.Fragment>, document.getElementById('app'));