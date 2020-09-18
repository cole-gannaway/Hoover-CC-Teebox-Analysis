import React, { Component } from 'react';
import { IYardageCalc } from '../../../interfaces/IYardageCalc';
import DataTableApi from '../../DataTableApi/DataTableApi';
import { CalculationUtils } from '../../../services/calculation-utils';
import { DataService } from '../../../services/data-service';

class CombinationTable extends Component<{ dataService: DataService, holeIds: number[], desiredYardages: number[], yardageCalcArr: IYardageCalc[] }, {}> {

    constructor(props: any) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }
    public render() {
        // construct header row
        const headerRow: string[] = [];
        headerRow.push('Combination');
        this.props.holeIds.forEach((holeId) => {
            headerRow.push('Hole #' + holeId.toString());
        });

        // compute combinations
        const combos = CalculationUtils.findAllCombos(this.props.holeIds, this.props.desiredYardages, this.props.yardageCalcArr);
        combos.sort((a: IYardageCalc[], b: IYardageCalc[]) => {
            return a[0].pinId - b[0].pinId;
        });
        // construct data rows
        const dataRows = combos.map((combo, index) => {
            // construct data row
            const dataRow: string[] = [];
            dataRow.push((index + 1).toString() + ' => Pin# ' + combo[0].pinId);
            this.props.holeIds.forEach((holeId) => {
                // default
                let cellVal = '-';
                const found = combo.find((val) => val.holeId === holeId);
                if (found) {
                    // show calculations
                    const pinInfo = this.props.dataService.getPinInfoForHole(found.holeId, found.pinId);
                    const markerInfo = this.props.dataService.getMarkerInfoForHole(found.holeId, found.markerId);
                    if (pinInfo && markerInfo) {
                        // constants
                        const yardage = markerInfo.yardage;
                        const slope = markerInfo.slope;
                        const pinDepth = pinInfo.depth;
                        const constantYardage = yardage + pinDepth + slope;
                        const markerAdjustment = found.desiredYardage - constantYardage;

                        cellVal = yardage.toString() + ' + ' + pinDepth.toString() + ' + ' + slope.toString() + ' + ' + markerAdjustment.toString() + ' = ' + found.desiredYardage.toString() + ' => Marker# ' + markerInfo.id;
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
            <DataTableApi data={countData}></DataTableApi>
        </div>);
    }
    handleClick() {

    }

}

export default CombinationTable;
