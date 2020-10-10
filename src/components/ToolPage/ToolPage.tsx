import React, { Component } from 'react';
import { DataService } from '../../services/data-service';
import DynamicInputRange from '../DynamicInputRange/DynamicInputRange';
import RangeChart from './RangeChart/RangeChart';


class ToolPage extends Component<{ dataService: DataService }, { desiredYardages: number[] }> {
    constructor(props: any) {
        super(props);
        this.state = {
            desiredYardages: [150, 150, 150, 150, 150]
        }
        this.handleDesiredYardageChange = this.handleDesiredYardageChange.bind(this);
    }
    public render() {
        const ranges = this.props.dataService.getAllRanges();

        // create hole ids from ranges
        const holeIds: number[] = [];
        ranges.forEach((rangeInfo) => {
            if (holeIds.findIndex((value) => value === rangeInfo.holeId) === -1) {
                holeIds.push(rangeInfo.holeId);
            }
        });

        // create rangesPerHole
        const rangesPerHoleId = holeIds.map((holeId, i) => {
            const desiredYardage = this.state.desiredYardages[i];
            return ranges.filter((rangeInfo) => rangeInfo.holeId === holeId).filter((rangeInfo) => rangeInfo.min <= desiredYardage && rangeInfo.max >= desiredYardage);
        });

        const numberInputs = holeIds.map((holeId, i) => {
            return (<td><DynamicInputRange value={this.state.desiredYardages[i]} index={i} min={0} max={100} handleChange={this.handleDesiredYardageChange} ></DynamicInputRange></td>);
        });
        numberInputs.unshift(<td></td>)

        // construct header row
        const headerRow = holeIds.map((holeId) => {
            return <th key={'headerHoleId' + holeId.toString()}>{'Hole #' + holeId.toString()}</th>
        });
        headerRow.unshift(<th>Row</th>);
        // construct data rows
        let maxLength: number = 0;
        rangesPerHoleId.forEach((rangeArr) => {
            if (maxLength < rangeArr.length) maxLength = rangeArr.length;
        })

        // create table rows
        const tableRows = [];
        for (let index = 0; index < maxLength; index++) {
            const rowData = [];
            rowData.push(<td>{index + 1}</td>)
            for (let i = 0; i < rangesPerHoleId.length; i++) {
                const arr = rangesPerHoleId[i];
                const desiredYardage = this.state.desiredYardages[i];

                let cellVal = '-';
                // no indexing out of bounds
                if (index < arr.length) {
                    const element = arr[index];
                    if (element.min <= desiredYardage && element.max >= desiredYardage) {
                        const teeboxYardage = element.min + element.delta;
                        const adjustment = desiredYardage - teeboxYardage;
                        cellVal = 'Teebox#' + element.teeboxId + ' Pin#' + element.pinId.toString() + ' => ' + teeboxYardage.toString() + ' + ' + adjustment.toString();
                    }
                } else {
                    console.log('this is bad')
                }
                rowData.push(<td key={'rowData' + i}>{cellVal}</td>)
            }
            tableRows.push(<tr key={'tableRow' + index}>{rowData}</tr>)
        }




        return (<div>
            <h2>Choose Yardages</h2>
            <div>Yaradage + Marker adjustment from center of teebox</div>
            <br></br>
            <table>
                <tbody>
                    <tr>
                        {headerRow}
                    </tr>
                    <tr>
                        {numberInputs}
                    </tr>
                    {tableRows}
                </tbody>
            </table>
            <br></br>
            <br></br>
            <RangeChart chartData={ranges}></RangeChart>
            <br></br>
            <br></br>
        </div>);
    }
    public handleDesiredYardageChange(index: number, value: number) {
        const cloned = this.cloneNumberArray(this.state.desiredYardages)
        cloned[index] = value;
        this.setState({ desiredYardages: cloned });
    }
    cloneNumberArray(arr: number[]) {
        const clone: number[] = [];
        arr.forEach((val) => clone.push(val));
        return clone;
    }
}

export default ToolPage;
