import React, { Component } from 'react';
import { DataService } from '../../../services/data-service';
import { IPinLocation } from '../../../resources/interfaces/IPinLocation';
import { ICourse } from '../../../resources/interfaces/ICourse';
import CustomNumberInput from './CustomNumberInput';

class PinDepthTableCustom extends Component<{ dataService: DataService, updateData(course: ICourse) : void, holeIds : number[], }, { customPinLocations : IPinLocation[] }> {

  constructor(props: any) {
    super(props);
    const initCustomPinLocations :IPinLocation[] = []
    const newPinLocId = 1;
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
    const headerRow : any[] = [];
    this.props.holeIds.forEach((holeId) => {
        headerRow.push(<th key={"custom-pin-loc-header-" +holeId.toString()}>{'Hole #' + holeId.toString()}</th>);
    });
    
    const newPinLocId = 1;
    const dataRow : any[] = [];
    const dataRowStyle : React.CSSProperties = {textAlign:"center"}
    this.props.holeIds.forEach((holeId) => {
        dataRow.push(<td key={"custom-pin-loc-value-" +holeId.toString()} style={dataRowStyle}>
          <CustomNumberInput style={dataRowStyle} updateParent={(newVal) => {this.handleChange(holeId,newPinLocId,newVal)}}></CustomNumberInput>
        </td>);
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
      <button style={{width:"60px"}} onClick={this.handleSubmit}>Save</button>

    </div>);
  }
  
  public handleChange(holeId:number, pinLocId :number, newVal :number) {
    var newDepth = 0
    if (!Number.isNaN(newVal)) {
        newDepth = newVal
    }
    const shallowCopy:IPinLocation[] = {...this.state.customPinLocations}
    shallowCopy[holeId-1] = {
        id: pinLocId,
        depth: newDepth
    }
    this.setState({
        customPinLocations:shallowCopy
    })

  }
  public handleSubmit(){
    const course = this.props.dataService.getAllData();
    course.holes.forEach(hole => {
        const holeId = hole.id
        const newPinLocInfo = this.state.customPinLocations[holeId-1]
        // set the new pin location id
        hole.pinLocations = [{
            id : newPinLocInfo.id,
            depth: newPinLocInfo.depth
        }]
    })
    
    // Deep clone
    const clonedCourse : ICourse = JSON.parse(JSON.stringify(course));
    // Update data
    this.props.updateData(clonedCourse)

    const initCustomPinLocations :IPinLocation[] = []
    const newPinLocId = 1;
    for (let i = 1; i <= 18; i++) {
        initCustomPinLocations.push({
            id:newPinLocId,
            depth:0
        })
    }
    this.setState({
        customPinLocations: initCustomPinLocations
    })

  }

}

export default PinDepthTableCustom;
