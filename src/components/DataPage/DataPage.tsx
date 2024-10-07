import React, { Component } from 'react';
import { DataService } from '../../services/data-service';
import CourseAnalysisTable from './CourseAnalysisTable/CourseAnalysisTable';
import HoleYardageTable from './HoleYardageTable/HoleYardageTable';
import MarkerDepthTable from './MarkerDepthTable/MarkerDepthTable';
import PinDepthTable from './PinDepthTable/PinDepthTable';
import SlopeTable from './SlopeTable/SlopeTable';
import { ICourse } from '../../resources/interfaces/ICourse';

class DataPage extends Component<{ dataService: DataService,updateData(course: ICourse) : void }, {}> {
    public render() {
        return (<div>
            <h1>Data Overview</h1>
            <h3>Pin Depths</h3>
            <PinDepthTable dataService={this.props.dataService} updateData={this.props.updateData}></PinDepthTable>
            <h3>Teebox Depths</h3>
            <div>{'(Teebox Depth / 2) - 1'}</div>
            <br></br>
            <MarkerDepthTable dataService={this.props.dataService}></MarkerDepthTable>
            <h3>Course Analysis</h3>
            <div>{'Yardage + Pin Depth + Slope \xB1 Teebox Depth'}</div>
            <br></br>
            <CourseAnalysisTable dataService={this.props.dataService}></CourseAnalysisTable>
            <h3>Hole Yardages</h3>
            <HoleYardageTable dataService={this.props.dataService}></HoleYardageTable>
            <h3>Slope Table</h3>
            <SlopeTable dataService={this.props.dataService}></SlopeTable>
        </div>);
    }
}

export default DataPage;
