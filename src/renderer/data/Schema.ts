// @ts-ignore
import {ObjectSchema} from 'react-enty';
// @ts-ignore
import {ArraySchema} from 'react-enty';
// @ts-ignore
import {EntitySchema} from 'react-enty';


const tab = new EntitySchema('tab');
const tabList = new ArraySchema(tab);
const dataTable = new EntitySchema('dataTable');
const dataTableList = new ArraySchema(dataTable)


export default new ObjectSchema({
    tabList,
    dataTableList
});