import React from 'react';
import Menu from '../components/menu';
import { Layout,Spin } from 'antd';
const { Header } = Layout;

const menu = ({load}) => {
    return (
        <Header>
            <div className="logo">
                <div className="title">智慧斑马线运营平台</div>
                <div className="company">浙江梧斯源科技股份有限公司</div>
            </div>
            <Menu/>
            <div className="banner">
                <Spin size="small" spinning={load}/>
                <Spin spinning={load}/>
                <Spin size="large" spinning={load}/>
            </div>  
        </Header>
    )
        
}


export default menu