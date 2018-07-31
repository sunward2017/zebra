import React from 'react';
import { connect } from 'react-redux';
import { Layout, } from 'antd';
import PlanMenu from './planMenu.js'
import { LocaleProvider, Divider } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';


const { Content, Footer } = Layout

export const Local = React.createContext({ local: '首页', toggleLoacl: () => { } });

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      local: '首页',
      toggleLocal: this.toggleLocal,
    }
  }

  toggleLocal = (m) => {
    this.setState({ local: m })
  }
  render() {
    const { load, children } = this.props
    const { local } = this.state;
    const whiteList = ['实时监控', '首页', '施工信息']
    return (
      <Layout>
        <Local.Provider value={{ ...this.state, load }}>
          <PlanMenu />
        </Local.Provider>
        {Array.indexOf(whiteList, local) === -1 ? < h3 className='header-top' > {this.state.local}</h3>  : null}
        <div className='header-top1'></div>
        <Content style={{ background: '#fcfcfc', padding: 24, minHeight: '86vh' }}>
          <LocaleProvider locale={zh_CN}>{children}</LocaleProvider>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          woosiyuan @ 2018
        </Footer>
      </Layout>
    )
  }
}

const auth = (state) => {
  return { load: state.load.state }
}

export default connect(auth)(App);