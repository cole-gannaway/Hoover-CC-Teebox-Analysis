import React, { Component } from 'react';

type DynamicInputRangeProps = {
    //
    value: number,
    index: number,
    max: number,
    min: number,
    handleChange(i: number, value: number): void
};

class DynamicInputRange extends Component<DynamicInputRangeProps, any> {
    constructor(props: DynamicInputRangeProps) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }
    public render() {

        return <div>
            <input type="number" value={this.props.value} onChange={this.handleChange} ></input>
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

export default DynamicInputRange;
