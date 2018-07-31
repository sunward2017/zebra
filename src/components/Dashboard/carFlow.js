import React from 'react';
import ReactEcharts from 'echarts-for-react';
import echarts from 'echarts';


class Cars extends React.Component {

    render() {
       var option = {
            backgroundColor:'#fff',
            title: {
                text: '车流量阶段统计图',
                left:'center',
                subtext: ''
            },
            xAxis: {
                type: 'category',
                data: this.props.xAxis
            },
            yAxis: {
                type: 'value'
            },
            series: [{
                data: this.props.carYAxis,
                type: 'bar',
                itemStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(
                            0, 0, 0, 1,
                            [
                                {offset: 0, color: '#83bff6'},
                                {offset: 0.5, color: '#188df0'},
                                {offset: 1, color: '#188df0'}
                            ]
                        )
                    },
                    emphasis: {
                        color: new echarts.graphic.LinearGradient(
                            0, 0, 0, 1,
                            [
                                {offset: 0, color: '#2378f7'},
                                {offset: 0.7, color: '#2378f7'},
                                {offset: 1, color: '#83bff6'}
                            ]
                        )
                    }
                },
            }]
        };
        return (
            <ReactEcharts
                option={option}
                style={{height: '400px', width: '100%'}}
                className={'react_for_echarts'}
            />
        )
    }
}

export default Cars;