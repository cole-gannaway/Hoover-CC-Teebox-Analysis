import React, { Component } from 'react';
import { IYardageCalc } from '../../../interfaces/IYardageCalc';
import DataTableApi from '../../DataTableApi/DataTableApi';




class DesiredYardageCountTable extends Component<{ holeIds: number[], desiredYardages: number[], yardageCalcArr: IYardageCalc[] }, {}> {

    public render() {
        // construct header row
        const headerRow: string[] = [];
        headerRow.push('Yardage');
        this.props.holeIds.forEach((holeId) => {
            headerRow.push('Hole #' + holeId.toString());
        });
        headerRow.push('Total');

        // construct data rows
        const dataRows = this.props.desiredYardages.map((desiredYardage) => {
            // construct data row
            const dataRow: string[] = [];
            dataRow.push(desiredYardage.toString());
            let count = 0;
            this.props.holeIds.forEach((holeId) => {
                // default
                const filtered = this.props.yardageCalcArr.filter((val) => val.holeId === holeId && val.desiredYardage === desiredYardage);
                let numOfMatches = filtered.length;
                dataRow.push(numOfMatches.toString());
                count += numOfMatches;
            });
            dataRow.push(count.toString());
            return dataRow;
        });

        const countData: string[][] = [];
        countData.push(headerRow);
        dataRows.forEach((row) => countData.push(row));

        return (<div>
            <DataTableApi data={countData}></DataTableApi>
        </div>);
    }

}

export default DesiredYardageCountTable;
