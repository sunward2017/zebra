import React from 'react';
import ReactEcharts from 'echarts-for-react';
import echarts from 'echarts';

var option = {
    title: {
        text: 'xx路车流情况',
        subtext: '纯属虚构'
    },
    tooltip: {
        trigger: 'axis'
    },
    legend: {
        data: ['成交']
    },
    toolbox: {
        show: true,
        feature: {
            mark: { show: false },
            dataView: { show: true, readOnly: false },
            magicType: { show: false, type: ['line', 'bar', 'stack', 'tiled'] },
            restore: { show:false },
            saveAsImage: { show: true }
        }
    },
    calculable: true,
    xAxis: [
        {
            type: 'category',
            boundaryGap: false,
            data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
        }
    ],
    yAxis: [
        {
            type: 'value'
        }
    ],
    series: [
        {
            name: '成交',
            type: 'line',
            smooth: true,
            itemStyle: {
                
                normal: {
                    color: "#975fe4",
                    lineStyle: {
                        color: "#975fe4"
                    },
                    areaStyle: {
                        type: 'default',
                        color:'#975fe4'
                    }
                }
            },
            data: [90, 182, 434, 791, 390, 30, 70]
        },
    ]
};

const Times = () => {

    return (
        <ReactEcharts
            option={option}
            style={{ height: '300px', width: '100%' }}
            className={'react_for_echarts'}
        />
    )

}

export default Times