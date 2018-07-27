import React, { PureComponent } from 'react';
import { Table, Tabs, Icon, notification, Button,  Modal } from 'antd';
import servers from '@/server'
import ZebraMateForm from './form'
import { formatData } from '@/utils'

import moment from 'moment'

const TabPane = Tabs.TabPane;
const confirm = Modal.confirm;



export default class ZebraMate extends PureComponent {
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
      this.getZebraMate({ zebracrossingId })
    }
  }
  componentDidMount() {
    const { zebracrossingId } = this.props;
    this.setState({ activeKey: '1' })
    this.getZebraMate({ zebracrossingId })
  }
  getZebraMate = (params) => {
    servers.getBanMaLineBomList(params).then(res => {
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

  refresh = () => {
    this.setState({ activeKey: '1' });
    const {zebracrossingId} = this.props;
    this.getZebraMate({zebracrossingId});
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
        servers.deleteBanMaLineBomInfo({ id }).then(res => {
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
      title: "物料名称",
      dataIndex: 'materialName',
      key: 'materialName',
      
    }, {
      title: '物料编号',
      dataIndex: 'materialCode',
      key: 'materialCode',
      
    }, {
      title: '物料类型',
      dataIndex: 'type',
      key: 'type',
      
    }, {
      title: '数量',
      dataIndex: 'amount',
      key: 'amount',
     
    }, {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      
    }, {
      title: '操作',
      key: 'action',
      render: (text, record) => (<span>
        <a href="javascript:;" onClick={() => { this.handleDelete(record) }}>删除</a>
      </span>
      )

    }];

    const { fields } = this.state;
    const operation = <Button type="primary" onClick={this.Add}> 新增 </Button>
    return (
      <Tabs tabBarExtraContent={operation} activeKey={this.state.activeKey} onChange={this.callback}>
        <TabPane tab={<span><Icon type="usergroup-add" />物料列表</span>} key="1">
          <Table dataSource={this.state.data} columns={columns} rowKey={record => record.id} />
        </TabPane>
        <TabPane tab={<span><Icon type="user-add" />物料输入</span>} key="2">
          <ZebraMateForm {...fields} refresh={this.refresh} />
        </TabPane>
      </Tabs>
    )
  }
}