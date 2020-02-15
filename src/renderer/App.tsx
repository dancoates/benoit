
import Api from './data/Api';
// @ts-ignore
import composeWith from 'unmutable/composeWith';
import React from 'react';
import QueryView from './QueryView';

const Provider = Api.Provider;

const ProviderHoc = () => (Component) => ({initialState, ...rest}) => <Provider initialState={initialState} debug={true}>
    <Component {...rest} />
</Provider>;

export default composeWith(
    ProviderHoc(),
    () => {
        return <QueryView/>;
    }
);