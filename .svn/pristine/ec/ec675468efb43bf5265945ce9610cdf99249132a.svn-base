import React, { PureComponent } from 'react';
import { Table, Tabs, Icon, notification, Button, Divider, Modal, Row, Form, DatePicker } from 'antd';
import servers from '@/server'
import RepairForm from './form'
import { formatData } from '@/utils'

import moment from 'moment'


const { RangePicker } = DatePicker;
const FormItem = Form.Item;

const TabPane = Tabs.TabPane;
const confirm = Modal.confirm;

const dateFormat = "YYYY-MM-DD HH:mm:ss";

export default class Repair extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      activeKey: '1',
      data: [],
      rangeDate: [moment().subtract(3, 'day'), moment()],
      fields: {
        devId: '',
        zebracrossingId: '',
        sendPerson: '',
        sendPhone: '',
        sendDay: '',
        problemDescribe: '',
        recvName: '',
        estimateDays: '',
        rebackDay: '',
        handlePrson: '',
        companyName: '',
        customerId: '',
        memo: '',
      },
    }
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.zebracrossingId !== this.props.zebracrossingId) {
      const { zebracrossingId } = nextProps
      this.getDeviceRepair({ zebracrossingId })
    }
  }
  componentDidMount() {
    this.handleSubmit();
  }
  getDeviceRepair = (params) => {
    const { rangeDate } = this.state;
    if (rangeDate.length > 1) {
      params = {
        ...params,
        'strStartTime': rangeDate[0].format(dateFormat),
        'strEndTime': rangeDate[1].format(dateFormat)
      }
    }
    servers.getDeviceRepairList(params).then(res => {
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

  handleSubmit = () => {
    const { zebracrossingId } = this.props;
    this.setState({ activeKey: '1' })
    this.getDeviceRepair({ zebracrossingId })
  }
  refresh = () => {
    this.setState({ rangeDate: [moment().subtract(3, 'day'), moment()] })
    this.handleSubmit()
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
    obj.sendDay = moment();
    obj.rebackDay = moment().add(3, 'd')
    obj.zebracrossingId = this.props.zebracrossingId
    this.setState({ activeKey: '2', fields: { ...formatData(obj) } });
  }

  modify = (r) => {
    r.sendDay = moment(r.sendDay);
    r.rebackDay = moment(r.rebackDay);
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
        servers.deleteDevRepairInfo({ id }).then(res => {
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
      title: '保修人',
      dataIndex: 'sendPerson',
      key: 'sendPerson',
      width: 150
    }, {
      title: '报修人手机',
      dataIndex: 'sendPhone',
      key: 'sendPhone',
      width: 250
    }, {
      title: '报修日期',
      dataIndex: 'sendDay',
      key: 'sendDay',
      width: 350
    }, {
      title: '故障描述',
      dataIndex: 'problemDescribe',
      key: 'problemDescribe',
      width: 350
    }, {
      title: '接收人',
      dataIndex: 'recvName',
      key: 'revcName',
      width: 150
    }, {
      title: '预期耗时',
      dataIndex: 'estimateDays',
      key: 'estimateDays',
      width: 150
    }, {
      title: '返回日期',
      dataIndex: 'rebackDay',
      key: 'rebackDay',
      width: 350
    }, {
      title: '处理人',
      dataIndex: 'handlePerson',
      key: 'handlePrson',
      width: 150
    }, {
      title: '公司名称',
      dataIndex: 'companyName',
      key: 'companyName',
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

    const { fields, rangeDate } = this.state;
    return (
      <div>
        <Row>
          <Form layout="inline">
            <FormItem
            >
              <RangePicker
                showTime={{ format: 'HH:mm:ss' }}
                format="YYYY-MM-DD HH:mm:ss"
                placeholder={['开始时间', '结束时间']}
                onChange={this.handleDateChange}
                defaultValue={rangeDate}
              />
            </FormItem>
            <FormItem>
              <Button
                icon="search"
                type="primary"
                onClick={this.handleSubmit}
              >
                搜索
              </Button>
              &emsp;&emsp;
              <Button icon="file-add" type="primary" onClick={this.Add}>新增</Button>
            </FormItem>
          </Form>
        </Row>
        <br />
        <Tabs activeKey={this.state.activeKey} onChange={this.callback}>
          <TabPane tab={<span><Icon type="usergroup-add" />维修单列表</span>} key="1">
            <Table dataSource={this.state.data} columns={columns} rowKey={record => record.id} scroll={{ x: '130%', y: 240 }} />
          </TabPane>
          <TabPane tab={<span><Icon type="user-add" />维修单输入</span>} key="2">
            <RepairForm {...fields} refresh={this.refresh}/>
          </TabPane>
        </Tabs>
      </div>
    )
  }
}