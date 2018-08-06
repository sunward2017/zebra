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
    const { load, children, user } = this.props
    const { local } = this.state;
    // const whiteList = ['实时监控', '施工信息']
    return (
      <Layout>
        <Local.Provider value={{ ...this.state, load }}>
          <PlanMenu />
        </Local.Provider>
        {/* {Array.indexOf(whiteList, local) === -1 ? < h3 className='header-top' > {this.state.local}</h3>  : null} */}
        <div className='header-top' >
          {this.state.local} &gt;&gt;
          <div className="UserWelcome">
            您好，<b>{user}</b>
          </div>
        </div>
        <Content>
          <div style={{ width: '90%', margin: '30px auto', border: '1px solid #ccc', background: '#fff' }}>
            <LocaleProvider locale={zh_CN}>{children}</LocaleProvider>
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          浙江梧斯源科技股份有限公司 woosiyuan @ 2018
        </Footer>
      </Layout>
    )
  }
}

const auth = (state) => {
  return { load: state.load.state, user: state.auth.user.account }
}

export default connect(auth)(App);