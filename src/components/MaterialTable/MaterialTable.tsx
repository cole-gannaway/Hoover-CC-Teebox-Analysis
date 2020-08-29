import React, { Component } from 'react';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

class MaterialTable extends Component<{ data: string[][] }, {}> {

    public render() {
        const data = this.props.data;
        const headerRow = data[0];
        const headerRowDataHTML = headerRow.map((val: string, i: number) => {
            return <TableCell key={'headerCell: ' + i}>{val}</TableCell>;
        });
        const dataRows = data.slice(1, data.length);
        const dataRowsHTML = dataRows.map((dataRow: string[], i) => {
            const dataRowHTML = dataRow.map((val, j: number) => {
                return <TableCell key={'dataCell: ' + i + ',' + j + ''}>{val}</TableCell>;
            });
            return <TableRow key={'dataRow: ' + i}>{dataRowHTML}</TableRow>;
        });


        return (
            <TableContainer component={Paper}>
                <Table size="small" aria-label="a dense table">
                    <TableHead>
                        <TableRow>{headerRowDataHTML}</TableRow>
                    </TableHead>
                    <TableBody>{dataRowsHTML}</TableBody>
                </Table>
            </TableContainer>
        );
    }
}

export default MaterialTable;
