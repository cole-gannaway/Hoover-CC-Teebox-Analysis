import React, { Component } from 'react';
import CanvasJSReact from '../../../lib/canvasjs.react'
import { IRangeInfo } from '../../../interfaces/IRangeInfo';

class RangeChart extends Component<{ chartData: IRangeInfo[] }, {}> {
    public render() {

        const dataPoints = this.props.chartData.map((data) => {
            return {
                x: data.holeId,
                y: [data.min, data.max],
                holeId: data.holeId,
                teeBoxId: data.teeboxId,
                pinId: data.pinId
            };
        });
        const options = {
            theme: "light2",
            exportEnabled: true,
            animationEnabled: true,
            title: {
                text: "Available Hole Yardages"
            },
            axisX: {
                title: "Hole (H)",
            },
            axisY: {
                title: "Yardages (Y)",
                includeZero: false,
                suffix: ""
            },
            data: [{
                type: "rangeColumn",
                toolTipContent: "<strong>Hole {holeId} Teebox {teeBoxId} PinId {pinId}</strong></br> Max: {y[1]}<br/> Min: {y[0]}",
                dataPoints: dataPoints
            }]
        }
        return (
            <div>
                <CanvasJSReact.CanvasJSChart options={options}
                /* onRef={ref => this.chart = ref} */
                />
                {/*You can get reference to the chart instance as shown above using onRef. This allows you to access all chart properties and methods*/}
            </div>
        );

    }

}

export default RangeChart;
