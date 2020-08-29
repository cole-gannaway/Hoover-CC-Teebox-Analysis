import React, { Component } from 'react';
import { DataService } from '../../services/data-service';
import MaterialTable from '../MaterialTable/MaterialTable';
import SelectAPI from '../SelectAPI/SelectAPI';
import { YardageUtils } from '../../services/yardage-utils';

const options = ['None', '3', '4', '5'];
class CourseAnalysisTable extends Component<{}, { parFilter: string, pinFilter: string, markerFilter: string }> {

    constructor(props: any) {
        super(props);
        this.state = {
            parFilter: '3',
            pinFilter: '1',
            markerFilter: '1'
        }
        this.handleParFilterChange = this.handleParFilterChange.bind(this);
        this.handlePinFilterChange = this.handlePinFilterChange.bind(this);
        this.handleMarkerFilterChange = this.handleMarkerFilterChange.bind(this);
    }
    public render() {
        let holeIds: number[] = [];
        if (this.state.parFilter === 'None') {
            holeIds = DataService.getAllHoleIds(null);
        } else {
            holeIds = DataService.getAllHoleIds(this.state.parFilter);
        }
        const markerIds = DataService.getAllMarkerIds();
        const pinIds = DataService.getAllPinLocationIds();

        const markerId = parseInt(this.state.markerFilter);
        const pinId = parseInt(this.state.pinFilter);

        // construct header row
        const headerRow: string[] = [];
        headerRow.push('Type');
        holeIds.forEach((holeId) => {
            headerRow.push('Hole #' + holeId.toString());
        });
        headerRow.push('Total');

        // construct min data row
        const minDataRow: string[] = [];
        minDataRow.push('Min');
        let minSum = 0;
        holeIds.forEach((holeId) => {
            const markerInfo = DataService.getMarkerInfoForHole(holeId, markerId);
            const pinInfo = DataService.getPinInfoForHole(holeId, pinId);
            // default
            let cellVal = '-';
            if (markerInfo && pinInfo) {
                const yardage = markerInfo.yardage;
                const pinDepth = pinInfo.depth;
                const markerDepth = markerInfo.depth;
                const markerDepthDelta = YardageUtils.computePlusMinus(markerDepth);
                // min
                const total = yardage + pinDepth - markerDepthDelta;
                minSum += total;
                cellVal = yardage.toString() + ' + ' + pinDepth.toString() + ' - ' + markerDepthDelta.toString() + ' = ' + total.toString();
            }
            minDataRow.push(cellVal);
        });
        minDataRow.push(minSum.toString());

        // construct max data row
        const maxDataRow: string[] = [];
        maxDataRow.push('Max');
        let maxSum = 0;
        holeIds.forEach((holeId) => {
            const markerInfo = DataService.getMarkerInfoForHole(holeId, markerId);
            const pinInfo = DataService.getPinInfoForHole(holeId, pinId);
            // default
            let cellVal = '-';
            if (markerInfo && pinInfo) {
                const yardage = markerInfo.yardage;
                const pinDepth = pinInfo.depth;
                const markerDepth = markerInfo.depth;
                const markerDepthDelta = YardageUtils.computePlusMinus(markerDepth);
                // max
                const total = yardage + pinDepth + markerDepthDelta;
                maxSum += total;
                cellVal = yardage.toString() + ' + ' + pinDepth.toString() + ' + ' + markerDepthDelta.toString() + ' = ' + total.toString();
            }
            maxDataRow.push(cellVal);
        });
        maxDataRow.push(maxSum.toString());


        const finalData: string[][] = [];
        finalData.push(headerRow);
        finalData.push(minDataRow);
        finalData.push(maxDataRow);

        const pinIdsAsStr = pinIds.map((id) => id.toString());
        const markerIdsAsStr = markerIds.map((id) => id.toString());
        return (<div>
            <div>
                Par <SelectAPI value={this.state.parFilter} options={options} handleChange={this.handleParFilterChange}></SelectAPI>
                Pin <SelectAPI value={this.state.pinFilter} options={pinIdsAsStr} handleChange={this.handlePinFilterChange}></SelectAPI>
                Marker <SelectAPI value={this.state.markerFilter} options={markerIdsAsStr} handleChange={this.handleMarkerFilterChange}></SelectAPI>
            </div>
            <MaterialTable data={finalData}></MaterialTable>
        </div>);
    }
    public handleParFilterChange(newVal: string) {
        this.setState({ parFilter: newVal });
    }
    public handlePinFilterChange(newVal: string) {
        this.setState({ pinFilter: newVal });
    }
    public handleMarkerFilterChange(newVal: string) {
        this.setState({ markerFilter: newVal });
    }

}

export default CourseAnalysisTable;
