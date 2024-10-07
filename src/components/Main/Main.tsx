import React, { Component } from 'react';
import { DataService } from '../../services/data-service';
import AppBar from '@material-ui/core/AppBar/AppBar';
import Tabs from '@material-ui/core/Tabs/Tabs';
import Tab from '@material-ui/core/Tab/Tab';
import DataPage from '../DataPage/DataPage';
import ToolPage from '../ToolPage/ToolPage';
import { ICourse } from '../../resources/interfaces/ICourse';

class Main extends Component<any, { pinLocationId: number, overviewPinDepthSum: number, dataService: DataService, tabIndex: number }> {
  constructor(props: any) {
    super(props);
    const createdDataService = new DataService();
    this.state = {
      pinLocationId: 1,
      overviewPinDepthSum: 0,
      dataService: createdDataService,
      tabIndex: 0,
    }
    this.handlePinLocationIdChange = this.handlePinLocationIdChange.bind(this);
    this.handleTabIndexChange = this.handleTabIndexChange.bind(this);
    this.updateDataService = this.updateDataService.bind(this);

  }

  public render() {
    const appBar = (<AppBar position="static">
      <Tabs value={this.state.tabIndex} onChange={this.handleTabIndexChange} aria-label="simple tabs example">
        <Tab label="Tool" />
        <Tab label="Data" />
      </Tabs>
    </AppBar>);
    let page = (<div></div>);
    switch (this.state.tabIndex) {
      case 0:
        page = (<ToolPage dataService={this.state.dataService}></ToolPage>);
        break;
      case 1:
        page = (<DataPage dataService={this.state.dataService} updateData={this.updateDataService}></DataPage>)
        break;
      default:
        break;
    }
    return (<div>
      {appBar}
      <div id="contentContainer">
        {page}
      </div>
    </div>);
  }

  public handlePinLocationIdChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const val = parseInt(event.target.value);
    this.setState({ pinLocationId: val });
  }

  public handleTabIndexChange(event: React.ChangeEvent<{}>, value: any) {
    const index = parseInt(value);
    this.setState({ tabIndex: index });
  }
  public updateDataService(data: ICourse) {
    const createdDataService = new DataService();
    createdDataService.setCourse(data);
    this.setState({ dataService: createdDataService });
  }

}

export default Main;
