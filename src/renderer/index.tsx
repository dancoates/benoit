import App from './App';
import ReactDom from 'react-dom';
import React from 'react';

console.log(React.version, ReactDom.version);

ReactDom.render(<App/>, document.getElementById('app'));