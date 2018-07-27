import React, { PureComponent } from 'react';
import { Table, Tabs, Icon, notification, Button, Divider, Modal, Row, Form, DatePicker } from 'antd';
import servers from '@/server'
import RepairForm from './form'
import { formatData } from '@/utils'

import moment from 'moment'

const TabPane = Tabs.TabPane;
const confirm = Modal.confirm;



export default class ZebraDev extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      activeKey: '1',
      data: [],
      rangeDate: [moment().subtract(3, 'day'), moment()],
      fields: {
        id: '',
        zebracrossingId: '',
        devSn: '',
        quantity: '',
        createTime: '',
        devId: '',
        qrCode: '',
        devMac: '',
        sysVer: '',
        boardVer: '',
        model: '',
        onlineFlag: '1',
        state: '',
        smsCard: '',
        memo: '',
      },
    }
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.zebracrossingId !== this.props.zebracrossingId) {
      const { zebracrossingId } = nextProps
      this.getZebraDevs({ zebracrossingId })
    }
  }
  componentDidMount() {
    const { zebracrossingId } = this.props;
    this.setState({ activeKey: '1' })
    this.getZebraDevs({ zebracrossingId })
  }
  getZebraDevs = (params) => {
    servers.getBanMaLineDevList(params).then(res => {
      if (res.result === 200) {
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

  refresh = () => {
    this.setState({ activeKey: '1' });
    const {zebracrossingId} = this.props;
    this.getZebraDev({zebracrossingId});
  }
  handleDateChange = (date, str) => {
    this.setState({ rangeDate: date })
  }
  callback = (activeKey) => {
    (!this.state.fields.Action) && (this.Add())
    this.setState({ activeKey });
  }

  Add = () => {
    let obj = this.state.fields;
    let fields = Object.keys(obj).map(i => { obj[i] = '' });
    obj.createTime = moment();
    obj.zebracrossingId = this.props.zebracrossingId
    this.setState({ activeKey: '2', fields: { ...formatData(obj) } });
  }

  modify = (r) => {
    r.createTime = moment(r.createTime);
    r.onlineFlag = r.onlineFlag+'';
    r.state = r.state+'';
    let data = formatData({ ...r })
    this.setState({ activeKey: '2', fields: { ...data } })
  }

  handleDelete = (record) => {
    let _this = this;
    confirm({
      title: "确认删除",
      content: record.momo,
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        let { id } = record;
        servers.deleteBanMaLineDevInfo({ id }).then(res => {
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
          _this.refresh();
        }).catch(e => { console.log(e) })
      },
      onCancel() {
        console.log('Cancel');
      },
    });

  }
  render() {
    const columns = [{
      title: "设备名称",
      dataIndex: 'devSn',
      key: 'devSn',
      width: 150
    }, {
      title: '数量',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 100
    }, {
      title: '设备MAC',
      dataIndex: 'devMac',
      key: 'devMAC',
      width: 150
    }, {
      title: '软件版本',
      dataIndex: 'sysVer',
      key: 'sysVer',
      width: 150
    }, {
      title: '硬件版本',
      dataIndex: 'boardVer',
      key: 'boardVer',
      width: 150
    }, {
      title: '型号',
      dataIndex: 'model',
      key: 'model',
      width: 150
    }, {
      title: '在线',
      dataIndex: 'onlineFlag',
      key: 'onlineFlag',
      width: 100
    }, {
      title: '状态',
      dataIndex: 'state',
      key: 'state',
      width: 100
    }, {
      title: 'sms卡',
      dataIndex: 'smsCard',
      key: 'smsCard',
      width: 150
    }, {
      title: '备注',
      dataIndex: 'memo',
      key: 'memo',
      width: 150
    }, {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 150,
      render: (text, record) => (<span>
        <a href="javascript:;" onClick={() => { this.modify(record) }}>修改</a>
        <Divider type="vertical" />
        <a href="javascript:;" onClick={() => { this.handleDelete(record) }}>删除</a>
      </span>
      )

    }];

    const { fields } = this.state;
    const operation = <Button type="primary" onClick={this.Add}> 新增 </Button>
    return (
      <Tabs tabBarExtraContent={operation} activeKey={this.state.activeKey} onChange={this.callback}>
        <TabPane tab={<span><Icon type="usergroup-add" />设备单列表</span>} key="1">
          <Table dataSource={this.state.data} columns={columns} rowKey={record => record.id} scroll={{ x: '130%', y: 240 }} />
        </TabPane>
        <TabPane tab={<span><Icon type="user-add" />设备清单输入</span>} key="2">
          <RepairForm {...fields} refresh={this.refresh} />
        </TabPane>
      </Tabs>
    )
  }
}