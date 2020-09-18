import React, { Component } from 'react';
import { DataService } from '../../services/data-service';
import DataTableApi from '../DataTableApi/DataTableApi';
import SelectAPI from '../SelectAPI/SelectAPI';
import { YardageUtils } from '../../services/yardage-utils';

const options = ['Any', '3', '4', '5'];
class CourseAnalysisTable extends Component<{ dataService: DataService }, { parFilter: string, teeBoxFilter: string }> {

    constructor(props: any) {
        super(props);
        this.state = {
            parFilter: '3',
            teeBoxFilter: '1'
        }
        this.handleParFilterChange = this.handleParFilterChange.bind(this);
        this.handleTeeBoxFilterChange = this.handleTeeBoxFilterChange.bind(this);
    }
    public render() {
        let holeIds: number[] = [];
        if (this.state.parFilter === 'Any') {
            holeIds = this.props.dataService.getAllHoleIds(null);
        } else {
            holeIds = this.props.dataService.getAllHoleIds(this.state.parFilter);
        }
        const teeBoxIds = this.props.dataService.getAllTeeboxIds();
        const pinIds = this.props.dataService.getAllPinLocationIds();

        const teeBoxId = parseInt(this.state.teeBoxFilter);

        // construct header row
        const headerRow: string[] = [];
        headerRow.push('Pin Location Id');
        holeIds.forEach((holeId) => {
            headerRow.push('Hole #' + holeId.toString());
        });
        headerRow.push('Total');

        // construct data rows
        const dataRows = pinIds.map((pinId) => {
            // construct data row
            const dataRow: string[] = [];
            dataRow.push(pinId.toString());
            let maxSum = 0;
            let minSum = 0;
            holeIds.forEach((holeId) => {
                const teeBoxInfo = this.props.dataService.getTeeboxInfoForHole(holeId, teeBoxId);
                const pinInfo = this.props.dataService.getPinInfoForHole(holeId, pinId);
                // default
                let cellVal = '-';
                if (teeBoxInfo && pinInfo) {
                    const yardage = teeBoxInfo.yardage;
                    const pinDepth = pinInfo.depth;
                    const markerDepth = teeBoxInfo.depth;
                    const slope = teeBoxInfo.slope;
                    const markerDepthDelta = YardageUtils.computePlusMinus(markerDepth);
                    // max
                    const highTotal = yardage + pinDepth + slope + markerDepthDelta;
                    maxSum += highTotal;
                    // min
                    const lowTotal = yardage + pinDepth + slope - markerDepthDelta;
                    minSum += lowTotal;
                    cellVal = yardage.toString() + ' + ' + pinDepth.toString() + ' + ' + slope.toString() + ' \xB1  ' + markerDepthDelta.toString() + ' = ( ' + lowTotal.toString() + ', ' + highTotal.toString() + ' )';
                }
                dataRow.push(cellVal);
            });
            dataRow.push('( ' + minSum.toString() + ', ' + maxSum.toString() + ' )');
            return dataRow;
        });

        const finalData: string[][] = [];
        finalData.push(headerRow);
        dataRows.forEach((row) => finalData.push(row));

        const teeBoxIdsAsStr = teeBoxIds.map((id) => id.toString());
        return (<div>
            <div>
                Par <SelectAPI value={this.state.parFilter} options={options} handleChange={this.handleParFilterChange}></SelectAPI>
                Teebox <SelectAPI value={this.state.teeBoxFilter} options={teeBoxIdsAsStr} handleChange={this.handleTeeBoxFilterChange}></SelectAPI>
            </div>
            <DataTableApi data={finalData}></DataTableApi>
        </div>);
    }
    public handleParFilterChange(newVal: string) {
        this.setState({ parFilter: newVal });
    }

    public handleTeeBoxFilterChange(newVal: string) {
        this.setState({ teeBoxFilter: newVal });
    }

}

export default CourseAnalysisTable;
