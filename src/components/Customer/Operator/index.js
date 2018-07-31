import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Table, Tabs, Icon, notification, Button, Divider, Modal, Tag,Popconfirm } from 'antd'
import servers from '@/server'
import ChannelForm from './form'
import { formatData } from '@/utils'

const TabPane = Tabs.TabPane;
const confirm = Modal.confirm;

class channel extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      activeKey: '1',
      data: [],
      fields: {
        account: '',
        password: '',
        name: '',
        gender: '1',
        faceUrl: '',
        brithday: '',
        telnumber: '',
        jobNumber: '',
        entryTime: '',
        quitTime: '',
        state: '',
        level: '',
      },
    }
  };

  componentDidMount() {
    this.getList()
  }

  getList = () => {
    let { customerId } = this.props;
    servers.getOperateList({ customerId: customerId }).then(res => {
      if (res.result == 200) {
        res.data ? this.setState({ data: res.data }) : this.setState({ data: [] });
      } else {
        const args = {
          message: '通信失败',
          description: res.message,
          duration: 2,
        };
        notification.error(args);
      }
    }).catch(
      err => { console.log(err) }
    )
  }

  callback = (activeKey) => {
    (!this.state.fields.Action) && (this.Add())
    this.setState({ activeKey });
  }

  Add = () => {
    let obj = this.state.fields;
    let fields = Object.keys(obj).map(k => { obj[k] = '' });
    obj.Action = 0;
    obj.gender = '1';
    obj.brithday = '1990-01-01 00:00:00';
    obj.entryTime = '2011-01-01 00:00:00';
    obj.quitTime = '2012-01-01 00:00:00';
    this.setState({ activeKey: '2', fields: { ...formatData(obj) } });
  }
  edit = (r) => {

    r.gender = r.gender.toString();

    let data = formatData({ ...r })
    this.setState({ activeKey: '2', fields: { Action: { value: 1 }, ...data } })
  }

  handleDelete = (record) => {
    let _this = this;
    // confirm({
    //   title: "你确认删除商户" + record.account,
    //   content: record.momo,
    //   okText: '确认',
    //   okType: 'danger',
    //   cancelText: '取消',
    //   onOk() {
    let { id } = record;
    servers.deleteOperateInfo({ id }).then(res => {
      if (res.result == 200) {
        const args = {
          message: '提交成功',
          description: res.message,
          duration: 2,
        };
        notification.success(args);
        _this.setState({ activeKey: '1' });
      } else {
        const args = {
          message: '提交失败',
          description: res.message,
          duration: 2,
        };
        notification.error(args);
      }
      _this.getList();
    }).catch(e => { console.log(e) })
    // },
    // onCancel() {
    //   console.log('Cancel');
    // },
    // });

  }

  handleModify = (options) => {
    let { customerId } = this.props;
    options.customerId = customerId;
    let _this = this;
    servers.modifyOperateInfo(options).then(res => {
      let { result, message } = res;
      if (result == 200) {
        const args = {
          message: '提交成功',
          description: message,
          duration: 2,
        };
        notification.success(args);
        this.setState({ activeKey: '1' });
      } else {
        const args = {
          message: '提交失败',
          description: message,
          duration: 2,
        };
        notification.error(args);
      }
      this.getList();
    })
  }

  render() {
    const columns = [{
      title: "登录名",
      dataIndex: 'account',
      key: 'account',
    }, {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '性别',
      dataIndex: 'gender',
      key: 'gender',
      render: (text, record) => {
        return text === 0 ? (<Tag color="red">女</Tag>) : (<Tag color="geekblue">男</Tag>)
      }
    }, {
      title: '手机号',
      dataIndex: 'telnumber',
      key: 'telnumber',
    }, {
      title: '工号',
      dataIndex: 'jobNumber',
      key: 'jobNumber',
    }, {
      title: '入职时间',
      dataIndex: 'entryTime',
      key: 'website',
    }, {
      title: '生日',
      dataIndex: 'brithday',
      key: 'brithday',
    }, {
      title: 'Action',
      key: 'action',
      render: (text, record) => (<span>
        <a href="javascript:;" onClick={() => { this.edit(record) }}>修改</a>
        <Divider type="vertical" />
        <Popconfirm title="确定删除?" onConfirm={() => this.handleDelete(record)}>
          <a href="javascript:;">删除</a>
        </Popconfirm>
      </span>
      )

    }];

    const fields = this.state.fields;
    const operation = <Button onClick={this.Add}>新增</Button>;

    return (
      <Tabs tabBarExtraContent={operation} activeKey={this.state.activeKey} onChange={this.callback}>
        <TabPane tab={<span><Icon type="usergroup-add" />员工列表</span>} key="1">
          <Table dataSource={this.state.data} columns={columns} rowKey={record => record.id} />
        </TabPane>
        <TabPane tab={<span><Icon type="user-add" />员工信息输入</span>} key="2">
          <ChannelForm modify={this.handleModify} {...fields} />
        </TabPane>
      </Tabs>
    )
  }
}

const mapState = (state) => {
  const { customerId } = state.auth.user;
  return { customerId }
};

export const Operator = connect(mapState)(channel);