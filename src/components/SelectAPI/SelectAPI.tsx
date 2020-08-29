import React, { Component } from 'react';
class SelectAPI extends Component<{ options: string[], value: string, handleChange(val: string): void }, {}> {
    constructor(props: any) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }
    public render() {
        const optionsHTML = this.props.options.map((option, i) => {
            return <option key={'option: ' + i}>{option}</option>
        })
        return <div>
            <select value={this.props.value} onChange={this.handleChange}>
                {optionsHTML}
            </select>
        </div>
    }

    public handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
        this.props.handleChange(event.target.value);
    }
}

export default SelectAPI;
