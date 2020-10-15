import React, { Component } from 'react';
import CanvasJSReact from '../../../lib/canvasjs.react'
import { IRangeInfo } from '../../../interfaces/IRangeInfo';
import { ColorService } from '../ColorService';

class RangeChart extends Component<{ chartData: IRangeInfo[] }, {}> {
    public render() {
        const dataPoints = this.props.chartData.map((data) => {
            const xCoord = data.holeId + (data.pinId / 10.0)
            return {
                x: xCoord,
                y: [data.min, data.max],

                holeId: data.holeId,
                teeBoxId: data.teeboxId,
                pinId: data.pinId
            };
        });

        const pin1DataPoints = dataPoints.filter((data) => data.pinId === 1);
        const pin2DataPoints = dataPoints.filter((data) => data.pinId === 2);
        const pin3DataPoints = dataPoints.filter((data) => data.pinId === 3);
        const pin4DataPoints = dataPoints.filter((data) => data.pinId === 4);
        const pin5DataPoints = dataPoints.filter((data) => data.pinId === 5);
        const pin6DataPoints = dataPoints.filter((data) => data.pinId === 6);

        const toolTipContent = "<strong>Hole {holeId} Teebox {teeBoxId} PinId {pinId}</strong></br> Max: {y[1]}<br/> Min: {y[0]}"
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
            dataPointWidth: 8,
            data: [
                {
                    type: "rangeColumn",
                    color: ColorService.getColorByPinId(1),
                    toolTipContent: toolTipContent,
                    dataPoints: pin1DataPoints,
                    dataPointWidth: 2
                },
                {
                    type: "rangeColumn",
                    color: ColorService.getColorByPinId(2),
                    toolTipContent: toolTipContent,
                    dataPoints: pin2DataPoints,
                },
                {
                    type: "rangeColumn",
                    color: ColorService.getColorByPinId(3),
                    toolTipContent: toolTipContent,
                    dataPoints: pin3DataPoints,
                },
                {
                    type: "rangeColumn",
                    color: ColorService.getColorByPinId(4),
                    toolTipContent: toolTipContent,
                    dataPoints: pin4DataPoints,
                },
                {
                    type: "rangeColumn",
                    color: ColorService.getColorByPinId(5),
                    toolTipContent: toolTipContent,
                    dataPoints: pin5DataPoints,
                },
                {
                    type: "rangeColumn",
                    color: ColorService.getColorByPinId(6),
                    toolTipContent: toolTipContent,
                    dataPoints: pin6DataPoints,
                },

            ]
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
