import React from 'react';
import { connect } from 'react-redux';
import { Table, notification, Button, Popconfirm, Row, Col } from 'antd';
import servers from '@/server'
import VersionEdit from './VersionEdit'

class versions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      addBtnFlag: false,
    };
    this.columns = [{
      title: '版本名称',
      dataIndex: 'versionName',
    }, {
      title: '版本号',
      dataIndex: 'versionCode',
    }, {
      title: '版本描述',
      dataIndex: 'versionDescription',
    }, {
      title: '文件大小',
      dataIndex: 'fileSize',
    }, {
      title: '上传者',
      dataIndex: 'uploader',
    }, {
      title: '上传时间',
      dataIndex: 'uploadTime'
    }, {
      title: '操作',
      dataIndex: 'operation',
      width: '10%',
      render: (text, record) => {
        return (
          <Popconfirm title="确定删除?" onConfirm={() => this.handleDelete(record.id)}>
            <a href="javascript:;">删除</a>
          </Popconfirm>
        );
      },
    }];
  }

  componentDidMount() {
    this.fetchVersionList();
  }

  fetchVersionList = () => {
    const { customerId } = this.props;
    servers.getVerInfoList({ customerId }).then(res => {
      console.log('list data:', res);
      if (res.result === 200) {
        res.data ? this.setState({ data: res.data }) : this.setState({ data: [] });
      } else {
        this.noticeErrInfo(res);
      }
    }).catch(
      err => { console.log(err) }
    )
  }

  noticeErrInfo = (res) => {
    const args = {
      message: '通信失败',
      description: res.message,
      duration: 2,
    };
    notification.error(args);
  }

  handleAddNewVersion = () => {
    this.setState({
      addBtnFlag: !this.state.addBtnFlag,
    });
    this.fetchVersionList();
  }

  handleDelete = (id) => {
    const that = this;
    servers.delVerInfoList({ id }).then(res => {
      if (res.result === 200) {
        notification.success({
          message: '成功提示',
          description: res.message,
        });
        that.fetchVersionList();
      } else {
        this.noticeErrInfo(res);
      }
    }).catch(
      err => { console.log(err) }
    )
  }

  render() {
    const { data, addBtnFlag } = this.state;
    return (
      <React.Fragment>
        <Table columns={this.columns} dataSource={data} rowKey={record => record.id} />
        <Col span={24}>
          <div className="table_tial">
            <div className="FunctionButton"><a href="javascript:;" onClick={this.handleAddNewVersion}>添加版本</a></div>
          </div>
        </Col>

        {
          addBtnFlag ?
            <VersionEdit onChange={this.handleAddNewVersion} customerId={this.props.customerId} /> : null
        }
      </React.Fragment>
    )
  }
}

const mapState = (state) => {
  const { customerId } = state.auth.user;
  return { customerId }
};
export const Versions = connect(mapState)(versions);