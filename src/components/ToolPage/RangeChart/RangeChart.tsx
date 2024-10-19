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
                pinId: data.pinId,
            };
        });

        // Find unique pin ids
        const pinIds =  Array.from(new Set(dataPoints.map(val => val.pinId)));
        const toolTipContent = "<strong>Hole {holeId} Teebox {teeBoxId} PinId {pinId}</strong></br> Max: {y[1]}<br/> Min: {y[0]}"

        // dynamicallly create options
        const data = pinIds.map(pinId => {
            return {
                type: "rangeColumn",
                color: ColorService.getColorByPinId(pinId),
                toolTipContent: toolTipContent,
                dataPoints: dataPoints.filter((data) => data.pinId === pinId),
            }
        })

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
            data: data
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
