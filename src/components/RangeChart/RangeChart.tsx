import React, { Component } from 'react';
import { IRangeChartData } from '../../interfaces/IRangeChartData';
import CanvasJSReact from '../../lib/canvasjs.react'

class RangeChart extends Component<{ chartData: IRangeChartData[] }, {}> {
    constructor(props: any) {
        super(props);
    }

    public render() {

        const dataPoints = this.props.chartData.map((data) => {
            return {
                x: data.x,
                y: [data.min, data.max],
                holeId: data.holeId,
                teeBoxId: data.teeBoxId
            };
        });
        const options = {
            theme: "dark2",
            exportEnabled: true,
            animationEnabled: true,
            title: {
                text: "Hole Ranges"
            },
            axisX: {
                // valueFormatString: "MMM YYYY"
            },
            axisY: {
                title: "Yardages (Y)",
                includeZero: false,
                suffix: ""
            },
            data: [{
                type: "rangeColumn",
                // indexLabel: "Hole {holeId} Teebox {teeBoxId}",
                // xValueFormatString: "Hole {holeId} Teebox {teeBoxId}",
                toolTipContent: "<strong>Hole {holeId} Teebox {teeBoxId}</strong></br> Max: {y[1]}<br/> Min: {y[0]}",
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
