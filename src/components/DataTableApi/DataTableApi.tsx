import React, { Component } from 'react';

import DataTable from 'react-data-table-component'


class DataTableApi extends Component<{ data: string[][] }, {}> {

    public render() {
        const headerRow = this.props.data[0];
        const columns = headerRow.map((header, index) => {
            return {
                name: header,
                selector: index.toString(),
                wrap: true,
                minWidth: "200px"
            }
        });
        const dataRows = this.props.data.slice(1, this.props.data.length);
        const data = dataRows.map((row, index) => {
            const flatMappedData: any = {};
            row.forEach((val, index) => {
                const key = index.toString()
                flatMappedData[key] = val;
            });
            return flatMappedData;
        })
        return (
            <DataTable noHeader={true} data={data} columns={columns} fixedHeader
                fixedHeaderScrollHeight="300px"></DataTable>

        );
    }
}

export default DataTableApi;
