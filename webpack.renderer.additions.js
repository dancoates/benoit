const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
console.log('CUSTOM WEBPACK');

module.exports = {
    plugins: [
        new MonacoWebpackPlugin({
            languages: ['sql', 'json']
        })
    ]

  }