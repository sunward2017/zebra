import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Table, Tabs, Icon, notification, Button, Divider, Modal, Tag } from 'antd'
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
        workerName: '',
        faceUrl: '',
        phoneNumber:'',
        telNumber1: '',
        postcode: '',
        email:'',
        qq:'',
        entryTime: '',
        quitTime: '',
        state: '',
        memo: '',
      },
    }
  };

  componentDidMount() {
    this.getList()
  }

  getList = () => {
    let { customerId, } = this.props;
    servers.getTeamList({ customerId: customerId }).then(res => {
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
    obj.entryTime = '2011-01-01 00:00:00';
    obj.quitTime = '2012-01-01 00:00:00';
    this.setState({ activeKey: '2', fields: { ...formatData(obj) }});
  }
  edit = (r) => {
    let data = formatData({ ...r })
    this.setState({ activeKey: '2', fields: { Action: { value: 1 }, ...data } })
  }

  handleDelete = (record) => {
    let _this = this;
    confirm({
      title: "你确认删除团队" + record.workerName,
      content: record.momo,
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        let { id } = record;
        servers.deleteTeamInfo({ id }).then(res => {
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
      },
      onCancel() {
        console.log('Cancel');
      },
    });

  }

  handleModify = (options) => {
    let { customerId } = this.props;
    options.customerId = customerId;
    let _this = this;
    servers.modifyTeamInfo(options).then(res => {
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
      title: "团队名称",
      dataIndex: 'workerName',
      key: 'workerName',
    }, {
      title: '业主地址',
      dataIndex: 'ownerAddress',
      key: 'ownerAddress',
    }, {
      title: '手机号',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
    },  {
      title: '电话号码',
      dataIndex: 'telNumber1',
      key: 'telNumber1',
    }, {
      title: '入职时间',
      dataIndex: 'entryTime',
      key: 'website',
    },{
      title: '备注',
      dataIndex: 'memo',
      key: 'memo',
    },{
      title: 'Action',
      key: 'action',
      render: (text, record) => (<span>
        <a href="javascript:;" onClick={() => { this.edit(record) }}>修改</a>
        <Divider type="vertical" />
        <a href="javascript:;" onClick={() => { this.handleDelete(record) }}>删除</a>
      </span>
      )

    }];

    const fields = this.state.fields;
    const operation = <Button onClick={this.Add}>新增</Button>;

    return (
      <Tabs tabBarExtraContent={operation} activeKey={this.state.activeKey} onChange={this.callback}>
        <TabPane tab={<span><Icon type="usergroup-add" />团队列表</span>} key="1">
          <Table dataSource={this.state.data} columns={columns} rowKey={record => record.id} bordered/>
        </TabPane>
        <TabPane tab={<span><Icon type="user-add" />团队信息输入</span>} key="2">
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