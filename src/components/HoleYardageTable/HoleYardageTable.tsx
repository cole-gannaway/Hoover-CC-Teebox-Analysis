import React, { Component } from 'react';
import { DataService } from '../../services/data-service';
import MaterialTable from '../MaterialTable/MaterialTable';
import SelectAPI from '../SelectAPI/SelectAPI';

const options = ['Any', '3', '4', '5'];
class HoleYardageTable extends Component<{}, { parFilter: string }> {

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
      holeIds = DataService.getAllHoleIds(null);
    } else {
      holeIds = DataService.getAllHoleIds(this.state.parFilter);
    }
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
      let yardageSum = 0;
      holeIds.forEach((holeId) => {
        const markerInfo = DataService.getMarkerInfoForHole(holeId, markerId);
        // default
        let cellVal = '-';
        if (markerInfo) {
          const yardage = markerInfo.yardage;
          yardageSum += yardage;
          cellVal = yardage.toString();
        }
        dataRow.push(cellVal);
      });
      dataRow.push(yardageSum.toString());
      return dataRow;
    });



    const finalData: string[][] = [];
    finalData.push(headerRow);
    dataRows.forEach((row) => finalData.push(row));

    return (<div>
      <div>
        Par
        <SelectAPI value={this.state.parFilter} options={options} handleChange={this.handleParFilterChange}></SelectAPI>
      </div>
      <MaterialTable data={finalData}></MaterialTable>
    </div>);
  }
  public handleParFilterChange(newVal: string) {
    this.setState({ parFilter: newVal });
  }
}

export default HoleYardageTable;
