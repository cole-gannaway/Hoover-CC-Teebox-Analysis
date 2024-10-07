import React, { Component } from 'react';

class CustomNumberInput extends Component<{ style : React.CSSProperties, updateParent(num: number) :void }, { value :string }> {

  constructor(props: any) {
    super(props);
    this.state = {
        value : "0"
    }
    this.handleBlur = this.handleBlur.bind(this);
    this.setValue = this.setValue.bind(this);
}

public render() {

    return (<input value={this.state.value} style={this.props.style} onChange={(e) => this.setValue(e.target.value)} onBlur={this.handleBlur}></input>);
  }

  public setValue(newVal :string){
    this.setState({
        value:newVal
    })
  }

  public handleBlur(){
    var num : number = parseInt(this.state.value)
    if (Number.isNaN(num)) {
        num = 0
        // set state
        this.setState({
            value:"0"
        })
    }
    this.props.updateParent(num)
  }

}

export default CustomNumberInput;
