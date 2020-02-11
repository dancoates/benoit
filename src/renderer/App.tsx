
import Api from './data/Api';
import composeWith from 'unmutable/composeWith';
import React from 'react';
import QueryView from './QueryView';

export default composeWith(
    Api.ProviderHoc(),
    () => {
        return <QueryView/>
    }
);