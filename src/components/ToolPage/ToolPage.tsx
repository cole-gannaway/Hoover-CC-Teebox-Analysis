import React, { Component } from 'react';
import { DataService } from '../../services/data-service';
import DynamicInputRange from '../DynamicInputRange/DynamicInputRange';


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
        const holeIds: number[] = [];

        // add holeIds
        ranges.forEach((rangeInfo) => {
            if (holeIds.findIndex((value) => value === rangeInfo.holeId) === -1) {
                holeIds.push(rangeInfo.holeId);
            }
        });

        const rangesPerHoleId = holeIds.map((holeId, i) => {
            return ranges.filter((rangeInfo) => rangeInfo.holeId === holeId);
        });



        const numberInputs = holeIds.map((holeId, i) => {
            return (<td><DynamicInputRange value={this.state.desiredYardages[i]} index={i} min={0} max={100} handleChange={this.handleDesiredYardageChange} ></DynamicInputRange></td>);
        });
        numberInputs.unshift(<td></td>)

        // construct header row
        const headerRow = holeIds.map((holeId) => {
            return <th key={'headerHoleId' + holeId.toString()}>{'Hole #' + holeId.toString()}</th>
        });
        headerRow.unshift(<th>Id</th>);
        // construct data rows
        let maxLength: number = 0;
        rangesPerHoleId.forEach((rangeArr) => {
            if (maxLength < rangeArr.length) maxLength = rangeArr.length;
        })

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
                        cellVal = '(' + element.min.toString() + ' , ' + element.max.toString() + ') => ' + '<' + element.teeboxId + ',' + element.pinId + '>' + ' => [' + teeboxYardage.toString() + ',' + adjustment.toString() + ']';
                    }
                } else {
                    console.log('this is bad')
                }
                rowData.push(<td key={'rowData' + i}>{cellVal}</td>)
            }
            tableRows.push(<tr key={'tableRow' + index}>{rowData}</tr>)
        }




        return (<div>
            <br></br>
            <br></br>
            <div>(Min,Max){' => <TeeboxId,PinId> => Adjustment'}</div>
            <br></br>
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
