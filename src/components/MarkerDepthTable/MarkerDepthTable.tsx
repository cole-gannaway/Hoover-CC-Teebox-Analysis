import React, { Component } from 'react';
import { DataService } from '../../services/data-service';
import DataTableApi from '../DataTableApi/DataTableApi';
import SelectAPI from '../SelectAPI/SelectAPI';
import { YardageUtils } from '../../services/yardage-utils';

const options = ['Any', '3', '4', '5'];
class MarkerDepthTable extends Component<{ dataService: DataService }, { parFilter: string }> {

    constructor(props: any) {
        super(props);
        this.state = {
            parFilter: '3'
        }
        this.handleParFilterChange = this.handleParFilterChange.bind(this);
    }
    public render() {
        let holeIds: number[] = [];
        if (this.state.parFilter === 'Any') {
            holeIds = this.props.dataService.getAllHoleIds(null);
        } else {
            holeIds = this.props.dataService.getAllHoleIds(this.state.parFilter);
        }
        const teeBoxIds = this.props.dataService.getAllTeeboxIds();

        // construct header row
        const headerRow: string[] = [];
        headerRow.push('Teebox Id');
        holeIds.forEach((holeId) => {
            headerRow.push('Hole #' + holeId.toString());
        });
        headerRow.push('Total');

        // construct data rows
        const dataRows = teeBoxIds.map((markerId) => {
            // construct data row
            const dataRow: string[] = [];
            dataRow.push(markerId.toString());
            let depthSum = 0;
            let deltaSum = 0;
            holeIds.forEach((holeId) => {
                const markerInfo = this.props.dataService.getTeeboxInfoForHole(holeId, markerId);
                // default
                let cellVal = '-';
                if (markerInfo) {
                    const depth = markerInfo.depth;
                    const delta = YardageUtils.computePlusMinus(depth);
                    depthSum += depth;
                    deltaSum += delta;
                    cellVal = '(' + depth.toString() + ' / 2) - 1 => \xB1 ' + delta.toString();
                }
                dataRow.push(cellVal);
            });
            dataRow.push(depthSum.toString() + ' => \xB1 ' + deltaSum.toString());
            return dataRow;
        });


        const finalData: string[][] = [];
        finalData.push(headerRow);
        dataRows.forEach((row) => finalData.push(row));

        return (<div>
            <div>
                Par <SelectAPI value={this.state.parFilter} options={options} handleChange={this.handleParFilterChange}></SelectAPI>
            </div>
            <DataTableApi data={finalData}></DataTableApi>
        </div>);
    }
    public handleParFilterChange(newVal: string) {
        this.setState({ parFilter: newVal });
    }
}

export default MarkerDepthTable;
