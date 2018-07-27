import React, { PureComponent } from 'react';
import { DatePicker } from 'antd';
const { MonthPicker, RangePicker, WeekPicker } = DatePicker;

export class search extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {}
    }
    onChange = (date,str) => {
    }
    render() {
        return(
        <div>
            <DatePicker onChange={this.onChange} />
            <br />
            <MonthPicker onChange={this.onChange} placeholder="Select month" />
            <br />
            <RangePicker onChange={this.onChange} />
            <br />
            <WeekPicker onChange={this.onChange} placeholder="Select week" />
        </div>
        )
    }
}