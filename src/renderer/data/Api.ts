// @ts-ignore
import {EntityApi} from 'react-enty';
import Schema from './Schema';


const api = EntityApi({
    tabList: async (payload: any) => console.log('tabList', payload),
    dataTableList: async (payload: any) => console.log('dataTableList', payload)

}, Schema);


export default api;
