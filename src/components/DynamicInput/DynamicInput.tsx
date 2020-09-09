import React, { Component } from 'react';

type DynamicInputProps = {
    //
    value: number,
    index: number
    handleChange(i: number, value: number): void
};

class DynamicInput extends Component<DynamicInputProps, any> {
    constructor(props: DynamicInputProps) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }
    public render() {

        return <div>
            <input type="text" value={this.props.value} onChange={this.handleChange} ></input>
        </div>;
    }
    public handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        const newVal = parseInt(event.target.value);
        if (newVal) {
            this.props.handleChange(this.props.index, newVal);
        } else {
            this.props.handleChange(this.props.index, 0);
        }
    }
}

export default DynamicInput;
