import React from 'react';
import Menu from '../components/menu';
import { Layout, Spin } from 'antd';
import { Local } from "./app"

const { Header } = Layout;

const menu = () => {
    return (
        <Local.Consumer>
            {
                ({ load, toggleLocal }) => (
                    <Header>
                        <div className="logo">
                             智慧斑马线运营平台
                        </div>
                        <Menu toggleLocal={toggleLocal} />
                        <div className="banner">
                            <Spin size="small" spinning={load} />
                            <Spin spinning={load} />
                            <Spin size="large" spinning={load} />
                        </div>
                    </Header>
                )
            }

        </Local.Consumer>
    )

}


export default menu