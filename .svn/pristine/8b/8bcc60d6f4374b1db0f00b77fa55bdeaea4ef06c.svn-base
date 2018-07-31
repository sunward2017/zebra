import React, { Component } from 'react'
import { List, message } from 'antd'
import servers from '@/server'


class ImgList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
    }
  }
  componentDidMount() {
    this.getImg();
  }
  getImg = () => {
    const { fuuid } = this.props;
    fuuid&&servers.getIMGList({ fuuid }).then(res => {
      if (res.result === 200) {
        res.data ? this.setState({ data: res.data }) : this.setState({ data: [] })
      } else {
        message.error('图片获取error')
      }
    })
  }
  render() {
    const { align, title } = this.props;
    return (
      <div>
        <List
          grid={align}
          header={title ? <div>{title}</div> : null}
          dataSource={this.state.data}
          renderItem={item => (<List.Item><img src={item.fileUrl} alt="图片" width="100%" height="100" /></List.Item>)}
        />
      </div>)
  }
}



export default ImgList;


