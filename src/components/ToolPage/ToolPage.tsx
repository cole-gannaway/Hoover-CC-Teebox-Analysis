import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import React, { Component } from 'react';
import { DataService } from '../../services/data-service';
import DynamicInputRange from '../DynamicInputRange/DynamicInputRange';
import { ColorService } from './ColorService';
import RangeChart from './RangeChart/RangeChart';
import Paper from '@material-ui/core/Paper';
import PinDepthTableCustom from '../DataPage/PinDepthTable/PinDepthTableCustom';
import { ICourse } from '../../resources/interfaces/ICourse';


class ToolPage extends Component<{ dataService: DataService, updateData(course: ICourse) : void }, { desiredYardages: number[] }> {
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

        // construct number input row
        const numberInputRow = holeIds.map((holeId, i) => {
            return <TableCell key={'numberInput' + i.toString()}><DynamicInputRange value={this.state.desiredYardages[i]} index={i} min={0} max={100} handleChange={this.handleDesiredYardageChange} ></DynamicInputRange></TableCell>
        });

        // construct header row
        const headerRow = holeIds.map((holeId, i) => {
            return <TableCell key={'headerHoleId' + i.toString()} style={{ textAlign: 'center', fontWeight: 'bold' }}>{'Hole #' + holeId.toString()}</TableCell>
        });

        // construct data rows
        let maxLength: number = 0;
        rangesPerHoleId.forEach((rangeArr) => {
            if (maxLength < rangeArr.length) maxLength = rangeArr.length;
        })

        // create table rows
        const tableRows = [];
        for (let index = 0; index < maxLength; index++) {
            const rowData = [];
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
                        const absoluteValueAdjustment = Math.abs(adjustment);
                        const forward_or_backward = adjustment === 0 ? "" : adjustment > 0 ? "forward" : "backward"
                        cellVal = 'Pin#' + element.pinId.toString() + ', Teebox ' + element.teeboxId + ', ' + absoluteValueAdjustment.toString() + ' step(s) ' + forward_or_backward + ' from Marker';
                        bgColor = ColorService.getColorByPinId(element.pinId);
                    }
                } else {
                    // console.log('defaulting')
                }
                rowData.push(<TableCell key={'rowData' + i} style={{ backgroundColor: bgColor }}>{cellVal}</TableCell>)
            }
            tableRows.push(<TableRow key={'tableRow' + index}>{rowData}</TableRow>)
        }

        // render
        return (<div>
            <h2>Enter Pin Depths</h2>
            <PinDepthTableCustom dataService={this.props.dataService} updateData={this.props.updateData} holeIds={holeIds} ></PinDepthTableCustom>
            <h2>Choose Yardages</h2>
            <div>{"Pin, Teebox, Marker Adjustment (from center of teebox)"}</div>
            <br></br>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            {headerRow}
                        </TableRow>
                        <TableRow>
                            {numberInputRow}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {tableRows}
                    </TableBody>
                </Table>
            </TableContainer>
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
