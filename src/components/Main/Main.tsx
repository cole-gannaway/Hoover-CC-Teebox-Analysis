import React, { Component } from 'react';
import PinDepthTable from '../PinDepthTable/PinDepthTable';
import MarkerDepthTable from '../MarkerDepthTable/MarkerDepthTable';
import HoleYardageTable from '../HoleYardageTable/HoleYardageTable';
import CourseAnalysisTable from '../CourseAnalysisTable/CourseAnalysisTable';
import FinalAnalysisTable from '../FinalAnalysisTable/FinalAnalysisTable';
import SlopeTable from '../SlopeTable/SlopeTable';
import { DataService } from '../../services/data-service';

class Main extends Component<any, { pinLocationId: number, overviewPinDepthSum: number, dataService: DataService }> {


  constructor(props: any) {
    super(props);
    const createdDataService = new DataService();
    this.state = {
      pinLocationId: 1,
      overviewPinDepthSum: 0,
      dataService: createdDataService
    }
    this.handlePinLocationIdChange = this.handlePinLocationIdChange.bind(this);
    this.handleUploadFileChange = this.handleUploadFileChange.bind(this);
    this.setDataServiceToNewFile = this.setDataServiceToNewFile.bind(this);
  }

  public render() {
    return (<div>
      <div>
        <h1>Custom Inputs</h1>
        <div>
          <div>Upload <input type="file" accept=".json" onChange={this.handleUploadFileChange}></input></div>
          <div>Download Original Data: <a href='https://drive.google.com/file/d/1C0cUoiSHonKCfyXHYroZLH3DznETKwGB/view?usp=sharing' >Download</a></div>
        </div>
        <h1>Final Analysis</h1>
        <FinalAnalysisTable dataService={this.state.dataService}></FinalAnalysisTable>
        <h1>Data Overview</h1>
        <h3>Pin Depths</h3>
        <PinDepthTable dataService={this.state.dataService}></PinDepthTable>
        <h3>Teebox Depths</h3>
        <div>{'(Teebox Depth / 2) - 1'}</div>
        <br></br>
        <MarkerDepthTable dataService={this.state.dataService}></MarkerDepthTable>
        <h3>Course Analysis</h3>
        <div>{'Yardage + Pin Depth + Slope \xB1 Teebox Depth'}</div>
        <br></br>
        <CourseAnalysisTable dataService={this.state.dataService}></CourseAnalysisTable>
        <h3>Hole Yardages</h3>
        <HoleYardageTable dataService={this.state.dataService}></HoleYardageTable>
        <h3>Slope Table</h3>
        <SlopeTable dataService={this.state.dataService}></SlopeTable>


      </div>
      <br></br>
      <br></br>

    </div>);
  }

  public handlePinLocationIdChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const val = parseInt(event.target.value);
    this.setState({ pinLocationId: val });
  }

  public handleUploadFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    var reader = new FileReader();
    const callBack = this.setDataServiceToNewFile;
    reader.onloadend = function (ev: ProgressEvent<FileReader>) {
      if (ev && ev.target && ev.target.result)
        callBack(JSON.parse(ev.target.result.toString()));
    }
    if (event.target.files)
      reader.readAsText(event.target.files[0]);
  }
  public setDataServiceToNewFile(data: any) {
    const createdDataService = new DataService();
    createdDataService.setCourse(data);
    this.setState({ dataService: createdDataService });
  }
}

export default Main;
