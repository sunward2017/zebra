import React from 'react';
import ReactEcharts from 'echarts-for-react';
import echarts from 'echarts';

class Peoples extends React.Component {
    render() {
        var option = {
            backgroundColor:'#fff',
            title: {
                text: '人流量阶段统计图',
                left:'center',
                subtext: ''
            },
            xAxis: {
                data:this.props.xAxis,
                axisLabel: {
                    inside: false,
                    textStyle: {
                        color: '#333'
                    }
                },
                axisTick: {
                    show: false
                },
                axisLine: {
                    show: false
                },
                z: 20
            },
            yAxis: {
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                axisLabel: {
                    textStyle: {
                        color: '#999'
                    }
                }
            },
            dataZoom: [
                {
                    type: 'inside'
                }
            ],
            series: [{
                    type: 'bar',
                    itemStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(
                                0, 0, 0, 1,
                                [
                                    {offset: 0, color: '#FEEAB0'},
                                    {offset: 0.4, color: '#FFD2A8'},
                                    {offset: 1, color: '#D69893'}
                                ]
                            )
                        },
                        emphasis: {
                            color: new echarts.graphic.LinearGradient(
                                0, 0, 0, 1,
                                [
                                    {offset: 0, color:'#FF9696'},
                                    {offset: 0.7, color: '#FFD2A8'},
                                    {offset: 1, color: '#FEEAB0'}
                                ]
                            )
                        }
                    },
                    data: this.props.peopleYAxis
                }
            ]
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

export default Peoples;