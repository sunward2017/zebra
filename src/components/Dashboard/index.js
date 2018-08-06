import 'whatwg-fetch';
import React, { Component } from 'react';
import { Map, Marker } from 'react-bmap';
import { message } from 'antd';
import citys from '@/asset/data/citys'
import servers from '@/server'

export class dashBoard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            markers: [],
            curCity: '',
        }
    }
    componentDidMount() {
        this.getArea();
    }
    getArea() {
        servers.getAreaInfoTree().then(res => {
            if (res.result === 200) {
                if (res.data && res.data.areaInfoList && res.data.areaInfoList.length > 0) {
                    const city = res.data.areaInfoList[0]
                    const { cityId, cityName } = city;

                    this.getDevMonitor({ cityId })
                    let curCity = (cityName.indexOf('市') == -1) ? (cityName + '市') : cityName;
                    this.setState({ curCity })
                }
            } else {
                message.error("获取地区失败", 2)
            }
        })
    }
    getDevMonitor = (cityId) => {
        servers.getDevMonitorInfo(cityId).then(res => {
            if (res.result === 200) {
                res.data ? this.setState({ markers: res.data }) : this.setState({ markers: [] })
            }
        })
    }
    render() {
        let { curCity } = this.state;
        let coors = citys[curCity] ? citys[curCity].split(',') : citys['上海市'].split(',');
        let { markers } = this.state;

        return (
            <React.Fragment>
                <Map
                    center={{
                        lng: coors[0],
                        lat: coors[1]
                    }}
                    zoom='12'
                    style={{ height: '80vh' }}
                >
                    {markers.map((marker, index) => {
                        return <Marker key={index} icon='loc_blue' position={{ lng: marker.longitude, lat: marker.latitude }} />
                    })}
                </Map>
            </React.Fragment>
        )

    }
}


