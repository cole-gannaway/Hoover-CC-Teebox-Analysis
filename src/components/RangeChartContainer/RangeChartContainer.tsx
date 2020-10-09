
import React, { Component } from 'react';
import { DataService } from '../../services/data-service';
import SelectAPI from '../SelectAPI/SelectAPI';
import { YardageUtils } from '../../services/yardage-utils';
import RangeChart from '../RangeChart/RangeChart';
import { IRangeChartData } from '../../interfaces/IRangeChartData';

const options = ['Any', '3', '4', '5'];
class RangeChartContainer extends Component<{ dataService: DataService }, { parFilter: string }> {

    constructor(props: any) {
        super(props);
        this.state = {
            parFilter: '3',
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
        const pinIds = this.props.dataService.getAllPinLocationIds();

        const chartData: IRangeChartData[] = [];
        holeIds.forEach((holeId) => {
            teeBoxIds.forEach((teeBoxId) => {
                let teeBoxMin = -1;
                let teeBoxMax = -1;
                pinIds.forEach((pinId) => {
                    const teeBoxInfo = this.props.dataService.getTeeboxInfoForHole(holeId, teeBoxId);
                    const pinInfo = this.props.dataService.getPinInfoForHole(holeId, pinId);
                    if (teeBoxInfo && pinInfo) {
                        const yardage = teeBoxInfo.yardage;
                        const pinDepth = pinInfo.depth;
                        const markerDepth = teeBoxInfo.depth;
                        const slope = teeBoxInfo.slope;
                        const markerDepthDelta = YardageUtils.computePlusMinus(markerDepth);
                        // max
                        const highTotal = yardage + pinDepth + slope + markerDepthDelta;
                        if (highTotal > teeBoxMax || teeBoxMax === -1)
                            teeBoxMax = highTotal;


                        // min
                        const lowTotal = yardage + pinDepth + slope - markerDepthDelta;
                        if (lowTotal < teeBoxMin || teeBoxMin === -1)
                            teeBoxMin = lowTotal;
                    }
                });
                const xVal: number = holeId + (teeBoxId / 10);
                chartData.push({ max: teeBoxMax, min: teeBoxMin, holeId: holeId, teeBoxId: teeBoxId, x: xVal });
            });
        });


        return (<div>
            <div>
                Par <SelectAPI value={this.state.parFilter} options={options} handleChange={this.handleParFilterChange}></SelectAPI>
            </div>
            <RangeChart chartData={chartData}></RangeChart>
        </div>);
    }
    public handleParFilterChange(newVal: string) {
        this.setState({ parFilter: newVal });
    }

}

export default RangeChartContainer;
