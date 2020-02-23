
import Api from './data/Api';
// @ts-ignore
import composeWith from 'unmutable/composeWith';
import React from 'react';
import QueryView from './QueryView';

const ProviderHoc = Api.ProviderHoc;


export default composeWith(
    ProviderHoc(),
    () => {
        return <QueryView/>;
    }
);