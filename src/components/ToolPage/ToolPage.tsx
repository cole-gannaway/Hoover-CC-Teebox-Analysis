import React, { Component } from 'react';
import { DataService } from '../../services/data-service';
import { NumberToLetterService } from '../../services/number-to-letter-service';
import DynamicInputRange from '../DynamicInputRange/DynamicInputRange';
import { ColorService } from './ColorService';
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
            return (<td key={'numberInput' + i.toString()}><DynamicInputRange value={this.state.desiredYardages[i]} index={i} min={0} max={100} handleChange={this.handleDesiredYardageChange} ></DynamicInputRange></td>);
        });
        numberInputs.unshift(<td key=''></td>)

        // construct header row
        const headerRow = holeIds.map((holeId) => {
            return <th key={'headerHoleId' + holeId.toString()}>{'Hole #' + holeId.toString()}</th>
        });
        headerRow.unshift(<th key={''}>Row</th>);
        // construct data rows
        let maxLength: number = 0;
        rangesPerHoleId.forEach((rangeArr) => {
            if (maxLength < rangeArr.length) maxLength = rangeArr.length;
        })

        // create table rows
        const tableRows = [];
        for (let index = 0; index < maxLength; index++) {
            const rowData = [];
            rowData.push(<td key={'dataCell' + index.toString()}>{index + 1}</td>)
            for (let i = 0; i < rangesPerHoleId.length; i++) {
                const arr = rangesPerHoleId[i];
                const desiredYardage = this.state.desiredYardages[i];

                let cellVal = '-';
                let bgColor = '';
                // no indexing out of bounds
                if (index < arr.length) {
                    const element = arr[index];
                    if (element.min <= desiredYardage && element.max >= desiredYardage) {
                        const teeboxYardage = element.min + element.delta;
                        const adjustment = desiredYardage - teeboxYardage;
                        cellVal = 'Teebox ' + NumberToLetterService.convertNumberToLetter(element.teeboxId) + ', Pin#' + element.pinId.toString() + ' => ' + teeboxYardage.toString() + ' + ' + adjustment.toString();
                        bgColor = ColorService.getColorByPinId(element.pinId);
                    }
                } else {
                    // console.log('defaulting')
                }
                rowData.push(<td key={'rowData' + i} style={{ backgroundColor: bgColor }}>{cellVal}</td>)
            }
            tableRows.push(<tr key={'tableRow' + index}>{rowData}</tr>)
        }




        return (<div>
            <h2>Choose Yardages</h2>
            <div>Yaradage + Marker adjustment from center of teebox</div>
            <br></br>
            <div id="toolTableContainer">

                <table id="toolTable" width={'100%'}>
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
            </div>
            <br></br>
            <br></br>
            <RangeChart chartData={ranges}></RangeChart>
            <br></br>
            <br></br>
        </div >);
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
    cloneString(original_string: string) {
        console.log(original_string)
        return original_string.slice();
    }
}

export default ToolPage;
