import React, { Component } from 'react';
import { DataService } from '../../../services/data-service';
import { IPinLocation } from '../../../resources/interfaces/IPinLocation';
import { ICourse } from '../../../resources/interfaces/ICourse';

class PinDepthTableCustom extends Component<{ dataService: DataService, updateData(course: ICourse) : void, holeIds : number[], }, { customPinLocations : IPinLocation[] }> {

  constructor(props: any) {
    super(props);
    const initCustomPinLocations :IPinLocation[] = []
    const newPinLocId = this.props.dataService.getAllPinLocationIds().length + 1;
    for (let i = 1; i <= 18; i++) {
        initCustomPinLocations.push({
            id:newPinLocId,
            depth:0
        })
    }
    this.state = {
        customPinLocations: initCustomPinLocations
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
}

public render() {
    // construct header row
    const headerRow = [];
    headerRow.push(<th key={"pin-loc-id-header"}>{"Pin Location Id"}</th>);
    this.props.holeIds.forEach((holeId) => {
        headerRow.push(<th key={"custom-pin-loc-header-" +holeId.toString()}>{'Hole #' + holeId.toString()}</th>);
    });
    
    const newPinLocId = this.props.dataService.getAllPinLocationIds().length + 1;
    console.log(this.props.dataService.getAllData())
    const dataRow = [];
    const dataRowStyle : React.CSSProperties = {textAlign:"center"}
    dataRow.push(<td key={"pin-loc-id"} style={dataRowStyle}>{newPinLocId}</td>)
    this.props.holeIds.forEach((holeId) => {
        dataRow.push(<td key={"custom-pin-loc-value-" +holeId.toString()} style={dataRowStyle}><input style={dataRowStyle} value={this.state.customPinLocations[holeId-1].depth} onChange={(e) => this.handleChange(holeId, newPinLocId, parseInt(e.target.value))}></input></td>);
    });

    return (<div>
      <div>Custom Add Pin Location Id</div>
      <table style={{width:"100%"}}>
        <thead>
          <tr>
            {headerRow}
          </tr>
        </thead>
        <tbody>
          <tr>
            {dataRow}
          </tr>
        </tbody>
      </table>
      <button style={{width:"60px"}} onClick={this.handleSubmit}>Add</button>

    </div>);
  }
  public handleChange(holeId:number, pinLocId :number, newVal :number) {
    var newDepth = 0
    if (!Number.isNaN(newVal)) {
        newDepth = newVal
    }
    console.log("Setting " + holeId + " to depth " + newDepth)
    const shallowCopy:IPinLocation[] = {...this.state.customPinLocations}
    shallowCopy[holeId-1] = {
        id: pinLocId,
        depth: newDepth
    }
    console.log(shallowCopy)
    this.setState({
        customPinLocations:shallowCopy
    })

  }
  public handleSubmit(){
    const course = this.props.dataService.getAllData();
    course.holes.forEach(hole => {
        // set the new pin location id
        hole.pinLocations.push({
            id:7,
            depth:0
        })
    })
    
    // Deep clone
    const clonedCourse : ICourse = JSON.parse(JSON.stringify(course));

    this.props.updateData(clonedCourse)

  }

}

export default PinDepthTableCustom;
