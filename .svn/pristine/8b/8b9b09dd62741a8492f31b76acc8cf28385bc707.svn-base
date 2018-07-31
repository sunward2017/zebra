import React from 'react';
import Calendar from './calendar';

export class Calen extends React.Component {
    /**
     * 初始状态
     * @returns {{tags: number[]}}
     */
     
    state={ 
       tags : {5:[{title:'代办事项5',content:'前方高能，谨慎行驶'},{title:'代办事项5',content:'前方高能，谨慎行驶'},{title:'代办事项5',content:'前方高能，谨慎行驶'}], 21:[{title:'代办事项21',content:'段友出征，寸草不生'}]}
    }

    /**
     * 选择日期
     * @param year
     * @param month
     * @param day
     */
    selectDate=(year, month, day)=>{
        console.log("选择时间为：" + year + '年' + month + '月' + day + '日' );
    }

    /**
     * 上一个月
     * @param year
     * @param month
     */
    previousMonth=(year, month)=>{
        console.log("当前日期为：" + year + '年' + month + '月');
        this.setState({tags : Object.assign({},{7:[{title:'代办事项7',content:'前方高能，谨慎行驶'}],18:[{title:'代办事项18',content:'前方高能，谨慎行驶'}],27:[{title:'代办事项27',content:'前方高能，谨慎行驶'}]})});
    }

    /**
     * 下一个月
     * @param year
     * @param month
     */
    nextMonth=(year, month)=>{
        console.log("当前日期为：" + year + '年' + month + '月');
        this.setState({tags : [8, 23]});
    }

    /**
     * 组件渲染
     * @returns {XML}
     */
    render() {
        return (
            <Calendar
                onSelectDate={this.selectDate}
                onPreviousMonth={this.previousMonth}
                onNextMonth={this.nextMonth}
                year="2018"
                month="6"
                day="14"
                row_number='6'
                col_number='7'
                tags={this.state.tags} />
        );
    }
}