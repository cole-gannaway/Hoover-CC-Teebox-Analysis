import React, { Component } from 'react';
import { DataService } from '../../services/data-service';
import MaterialTable from '../MaterialTable/MaterialTable';

class MarkerDepthTable extends Component<{}, {}> {
    public render() {
        let holeIds: number[] = DataService.getAllHoleIdsWithMarkers();
        const markerIds = DataService.getAllMarkerIds();

        // construct header row
        const headerRow: string[] = [];
        headerRow.push('Marker Id');
        holeIds.forEach((holeId) => {
            headerRow.push('Hole #' + holeId.toString());
        });
        headerRow.push('Total');

        // construct data rows
        const dataRows = markerIds.map((markerId) => {
            // construct data row
            const dataRow: string[] = [];
            dataRow.push(markerId.toString());
            let depthSum = 0;
            let deltaSum = 0;
            holeIds.forEach((holeId) => {
                const markerInfo = DataService.getMarkerInfoForHole(holeId, markerId);
                // default
                let cellVal = '-';
                if (markerInfo) {
                    const depth = markerInfo.depth;
                    const delta = Math.floor((depth / 2)) - 1;
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
            <MaterialTable data={finalData}></MaterialTable>
        </div>);
    }
    public handleParFilterChange(newVal: string) {
        this.setState({ parFilter: newVal });
    }
}

export default MarkerDepthTable;
