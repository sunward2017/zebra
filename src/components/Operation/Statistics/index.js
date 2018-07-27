import 'whatwg-fetch';
import React, { Component } from 'react';
import { Row, Col, Tabs, Divider, Popover, notification, Button } from 'antd';
import citys from '@/asset/data/citys'
import './style.css'
import servers from '@/server'
import SearchForm from './searchForm'
import Cars from './carFlow'
import Peoples from './peopleFlow'

const TabPane = Tabs.TabPane;


export class dashBoard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            onRankListData: [],
            timesRankListData: [],
            curCity: '',
            xAxis: [],
            carYAxis: [],
            peopleYAxis: [],
            zebraCitys: [],
            visible: true,
        }
    }
    componentDidMount() {
        this.getArea();
    }
    getArea() {
        let _this = this;
        servers.getAreaInfoTree().then(res => {
            if (res.result === 200) {
                if (res.data) {
                    let area = res.data.areaInfoList.map(item => { return { id: item.cityId, name: item.cityName } });
                    _this.setState({ zebraCitys: area })
                }
            }
        })
    }
    getResult = (params) => {
        let curCity = this.state.zebraCitys.find(item => { if (item.id === params.cityId) return item }).name + '市';
        this.setState({ curCity })
        servers.getDevMonitorInfo(params).then(res => {
            if (res.result === 200) {
                let { data } = res;
                let xAxis = [];
                let carYAxis = [];
                let peopleYAxis = [];
                let onRankListData = [];
                let timesRankListData = []

                data && data.forEach(item => {
                    xAxis.push(item.zebracrossingName);
                    item.carCount ? carYAxis.push(item.carCount) : carYAxis.push(0);
                    item.peopleCount ? peopleYAxis.push(item.peopleCount) : peopleYAxis.push(0);
                    onRankListData.push(item)
                    timesRankListData.push(item)
                });
                onRankListData.sort((p, n) => { return p.ledOnDuration > n.ledOnDuration })
                timesRankListData.sort((p, n) => { return p.ledOnTimes > n.ledOnTimes })
                this.setState({ xAxis, carYAxis, peopleYAxis, onRankListData, timesRankListData });
            } else {
                const args = {
                    message: '监控接口故障',
                    description: res.message,
                    duration: 2,
                };
                notification.error(args);
            }

        })
    }

    render() {
        let { curCity, xAxis, carYAxis, peopleYAxis, onRankListData, timesRankListData, zebraCitys } = this.state;
        let coors = citys[curCity] ? citys[curCity].split(',') : citys['上海市'].split(',');

        let { markers } = this.state;
        const topColResponsiveProps = {
            xs: 24,
            sm: 12,
            md: 12,
            lg: 12,
            xl: 6,
            content: {  width: '80%', margin: '30px auto', padding: '20px', boxShadow: '0px 0px 100px rgba(0,0,0,0.28)' }
        };

        return (
            <React.Fragment>
                <h2>
                    <span>统计排行</span>
                    <div style={{ float: 'right', marginRight: 20 }}> {zebraCitys.length > 0 ? <SearchForm zebraCitys={zebraCitys} handleGetResult={this.getResult} /> : ''}</div>
                </h2>
                <Divider dashed />
                <Row gutter={16} style={topColResponsiveProps.content}>
                    <Col xl={16} lg={12} md={12} sm={24} xs={24} >
                        <Cars xAxis={xAxis} carYAxis={carYAxis} />
                    </Col>

                    <Col xl={8} lg={12} md={12} sm={24} xs={24}>
                        <div className="salesRank">
                            <h4 className="rankingTitle">阶段亮灯时长排名</h4>
                            <ul className="rankingList">
                                {
                                    onRankListData.map((item, i) => (
                                        <li key={item.id}>
                                            <span className={(i < 3) ? 'active' : ''}>{i + 1}</span>
                                            <span>{item.zebracrossingName}</span>
                                            <span>{item.ledOnDuration} 小时</span>
                                        </li>
                                    ))
                                }
                            </ul>
                        </div>
                    </Col>
                </Row>
                <br /><br />
                <Row gutter={16} style={topColResponsiveProps.content}>
                    <Col xl={16} lg={12} md={12} sm={24} xs={24}>
                        <Peoples xAxis={xAxis} peopleYAxis={peopleYAxis} />
                    </Col>
                    <Col xl={8} lg={12} md={12} sm={24} xs={24}>
                        <div className="salesRank">
                            <h4 className="rankingTitle">阶段亮灯次数排名</h4>
                            <ul className="rankingList">
                                {
                                    timesRankListData.map((item, i) => (
                                        <li key={item.id}>
                                            <span className={(i < 3) ? 'active' : ''}>{i + 1}</span>
                                            <span>{item.zebracrossingName}</span>
                                            <span>{item.ledOnTimes} 次</span>
                                        </li>
                                    ))
                                }
                            </ul>
                        </div>
                    </Col>
                </Row>
            </React.Fragment>
        )

    }
}


