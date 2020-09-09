import React, { Component } from 'react';
import PinDepthTable from '../PinDepthTable/PinDepthTable';
import MarkerDepthTable from '../MarkerDepthTable/MarkerDepthTable';
import HoleYardageTable from '../HoleYardageTable/HoleYardageTable';
import CourseAnalysisTable from '../CourseAnalysisTable/CourseAnalysisTable';
import FinalAnalysisTable from '../FinalAnalysisTable/FinalAnalysisTable';

class Main extends Component<any, { pinLocationId: number, overviewPinDepthSum: number }> {

  constructor(props: any) {
    super(props);
    this.state = {
      pinLocationId: 1,
      overviewPinDepthSum: 0
    }
    this.handlePinLocationIdChange = this.handlePinLocationIdChange.bind(this);
    this.handleAnyInputChange = this.handleAnyInputChange.bind(this);
  }

  public render() {
    return (<div>
      <div>
        <h1>Data Overview</h1>
        <h3>Pin Depths</h3>
        <PinDepthTable></PinDepthTable>
        <h3>Teebox Depths</h3>
        <div>{'(Teebox depth / 2) - 1'}</div>
        <br></br>
        <MarkerDepthTable></MarkerDepthTable>
        <h3>Hole Yardages</h3>
        <HoleYardageTable></HoleYardageTable>
        <h3>Course Analysis</h3>
        <div>{'Yardage + Pin Depth \xB1 Marker Depth'}</div>
        <br></br>
        <CourseAnalysisTable></CourseAnalysisTable>
        <h1>Final Analysis</h1>
        <FinalAnalysisTable></FinalAnalysisTable>
      </div>
      <br></br>
      <br></br>

    </div>);
  }

  public handlePinLocationIdChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const val = parseInt(event.target.value);
    this.setState({ pinLocationId: val });
    this.handleAnyInputChange();
  }


  public handleAnyInputChange() {
    // do calculations
    // overview calculations

  }
}

export default Main;
