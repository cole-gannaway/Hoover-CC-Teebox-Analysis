import React, { Component } from 'react';
import { DataService } from '../../services/data-service';
import DataTableApi from '../DataTableApi/DataTableApi';
import SelectAPI from '../SelectAPI/SelectAPI';
import { YardageUtils } from '../../services/yardage-utils';

const options = ['Any', '3', '4', '5'];
class CourseAnalysisTable extends Component<{ dataService: DataService }, { parFilter: string, markerFilter: string }> {

    constructor(props: any) {
        super(props);
        this.state = {
            parFilter: '3',
            markerFilter: '1'
        }
        this.handleParFilterChange = this.handleParFilterChange.bind(this);
        this.handleMarkerFilterChange = this.handleMarkerFilterChange.bind(this);
    }
    public render() {
        let holeIds: number[] = [];
        if (this.state.parFilter === 'Any') {
            holeIds = this.props.dataService.getAllHoleIds(null);
        } else {
            holeIds = this.props.dataService.getAllHoleIds(this.state.parFilter);
        }
        const markerIds = this.props.dataService.getAllMarkerIds();
        const pinIds = this.props.dataService.getAllPinLocationIds();

        const markerId = this.state.markerFilter;

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
                const markerInfo = this.props.dataService.getMarkerInfoForHole(holeId, markerId);
                const pinInfo = this.props.dataService.getPinInfoForHole(holeId, pinId);
                // default
                let cellVal = '-';
                if (markerInfo && pinInfo) {
                    const yardage = markerInfo.yardage;
                    const pinDepth = pinInfo.depth;
                    const markerDepth = markerInfo.depth;
                    const slope = markerInfo.slope;
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

        const markerIdsAsStr = markerIds.map((id) => id.toString());
        return (<div>
            <div>
                Par <SelectAPI value={this.state.parFilter} options={options} handleChange={this.handleParFilterChange}></SelectAPI>
                Marker <SelectAPI value={this.state.markerFilter} options={markerIdsAsStr} handleChange={this.handleMarkerFilterChange}></SelectAPI>
            </div>
            <DataTableApi data={finalData}></DataTableApi>
        </div>);
    }
    public handleParFilterChange(newVal: string) {
        this.setState({ parFilter: newVal });
    }

    public handleMarkerFilterChange(newVal: string) {
        this.setState({ markerFilter: newVal });
    }

}

export default CourseAnalysisTable;
