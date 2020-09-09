import React, { Component } from 'react';
import { IYardageCalc } from '../../../interfaces/IYardageCalc';
import MaterialTable from '../../MaterialTable/MaterialTable';
import { CalculationUtils } from '../../../services/calculation-utils';
import { DataService } from '../../../services/data-service';

class CombinationTable extends Component<{ holeIds: number[], desiredYardages: number[], yardageCalcArr: IYardageCalc[] }, {}> {


    public render() {
        // construct header row
        const headerRow: string[] = [];
        headerRow.push('Combination');
        this.props.holeIds.forEach((holeId) => {
            headerRow.push('Hole #' + holeId.toString());
        });

        // compute combinations
        const foundCombo: IYardageCalc[] = CalculationUtils.findCombo(this.props.holeIds, this.props.desiredYardages, this.props.yardageCalcArr);

        const combos: IYardageCalc[][] = [foundCombo];
        // construct data rows
        const dataRows = combos.map((combo, index) => {
            // construct data row
            const dataRow: string[] = [];
            dataRow.push((index + 1).toString());
            this.props.holeIds.forEach((holeId) => {
                // default
                let cellVal = '-';
                const found = combo.find((val) => val.holeId === holeId);
                if (found) {
                    // show calculations
                    const pinInfo = DataService.getPinInfoForHole(found.holeId, found.pinId);
                    const markerInfo = DataService.getMarkerInfoForHole(found.holeId, found.markerId);
                    if (pinInfo && markerInfo) {
                        // constants
                        const yardage = markerInfo.yardage;
                        const pinDepth = pinInfo.depth;
                        const constantYardage = yardage + pinDepth;
                        const markerAdjustment = found.desiredYardage - constantYardage;

                        cellVal = yardage.toString() + ' + ' + pinDepth.toString() + ' + ' + markerAdjustment.toString() + ' = ' + found.desiredYardage.toString();
                    }

                }
                dataRow.push(cellVal);
            });
            return dataRow;
        });

        const countData: string[][] = [];
        countData.push(headerRow);
        dataRows.forEach((row) => countData.push(row));

        return (<div>
            <MaterialTable data={countData}></MaterialTable>
        </div>);
    }

}

export default CombinationTable;
