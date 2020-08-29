import React, { Component } from 'react';
import PinDepthTable from '../PinDepthTable/PinDepthTable';
import MarkerDepthTable from '../MarkerDepthTable/MarkerDepthTable';

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
        <h2>Overview</h2>
        <h4>Pin Depths</h4>
        <PinDepthTable></PinDepthTable>
        <h4>Teebox Depths</h4>
        <MarkerDepthTable></MarkerDepthTable>
      </div>
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
