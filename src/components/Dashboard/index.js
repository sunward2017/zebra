import 'whatwg-fetch';
import React, { Component } from 'react';
import { Map, MapvLayer } from 'react-bmap';
import { message } from 'antd';
import citys from '@/asset/data/citys'
import servers from '@/server'

export class dashBoard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            markers: [{ "geometry": { "type": "Point", "coordinates": [120.160738, 30.280761] } }, { "geometry": { "type": "Point", "coordinates": [120.117385, 30.274305] } }],
            curCity: '',
        }
    }
    componentDidMount() {
        this.getArea();
    }
    getArea() {
        servers.getAreaInfoTree().then(res => {
            if (res.result === 200) {
                if (res.data&&res.data.areaInfoList&&res.data.areaInfoList.length>0) {
                    let curCity = res.data.areaInfoList[0].cityName||'杭州';
                    curCity = (curCity.indexOf('市') == -1) ? (curCity + '市') : curCity;
                    this.setState({ curCity })
                }
            } else {
                message.error("获取地区失败", 2)
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
                    zoom='5'
                    style={{ height: '80vh' }}
                    > 
                    <MapvLayer
                        data={markers}
                        options={{
                            fillStyle: 'rgba(255, 250, 150, 0.8)',
                            shadowColor: 'rgba(255, 250, 50, 0.3)',
                            shadowBlur: 30,
                            globalCompositeOperation: 'lighter',
                            size: 5,
                            draw: 'simple',
                            autoViewport: true,
                            viewportOptions: { zoomFactor: -3 }
                        }}
                    />
                </Map>
            </React.Fragment>
        )

    }
}


