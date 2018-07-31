import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Table, Tabs, Icon, notification, Button, Divider,Modal } from 'antd'
import servers from '@/server'
import ChannelForm from './form'
import { formatData, restore } from '@/utils'

const TabPane = Tabs.TabPane;
const confirm = Modal.confirm;

class channel extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      activeKey: '1',
      data: [],
      fields: {
        customerName: '',
        customerId: '',
        customerAddress: '',
        contacts: '',
        faceUrl: '',
        phoneNumber: '',
        telNumber1: '',
        postcode: '',
        email: '',
        qq: '',
        fax: '',
        website: '',
        memo: ''
      },
    }
  };

  componentDidMount() {
    this.getCustomer()
  }

  getCustomer = () => {
    let { customerId, } = this.props;
    servers.getCustomerList({ customerId: customerId }).then(res => {
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
    let fields = Object.keys(obj).map(i => { obj[i] = '' });
    this.setState({ activeKey: '2', fields: {...formatData(obj), Action: { value: 0 }}});
  }

  modify = (r) => {
    let data = formatData({ ...r })
    this.setState({ activeKey: '2', fields: {...data,Action: { value: 1 }} })
  }

  handleFormChange = (changedFields) => {
    this.setState(({ fields }) => ({
      fields: { ...fields, ...changedFields },
    }));
  }

  handleDelete = (record) => {
    let _this =this;
    confirm({
      title: "你确认删除商户"+record.customerName,
      content: record.momo,
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        let { customerId } = record;
        servers.deleteCustomerInfo({customerId}).then(res=>{
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
          _this.getCustomer();
        }).catch(e=>{console.log(e)})
      },
      onCancel() {
        console.log('Cancel');
      },
    });
 
  }

  handleModifyCustomerInfo = () => {
    let options = restore(this.state.fields)
    let _this =this;
    servers.modifyCustomerInfo(options).then(res => {
      let { result, message } = res;
      if (result == 200) {
        const args = {
          message: '提交成功',
          description: message,
          duration: 2,
        };
        notification.success(args);
        this.setState({ activeKey: '1' });
        this.getCustomer();
      } else {
        const args = {
          message: '提交失败',
          description: message,
          duration: 2,
        };
        notification.error(args);
      }
    
    })
  }

  render() {
    const columns = [{
      title: "商户名称",
      dataIndex: 'customerName',
      key: 'customerName',
    }, {
      title: '商户住址',
      dataIndex: 'customerAddress',
      key: 'customerAddress',
    }, {
      title: '联系人',
      dataIndex: 'contacts',
      key: 'contacts',
    }, {
      title: '手机号',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
    }, {
      title: 'E-mail',
      dataIndex: 'email',
      key: 'email',
    }, {
      title: '网址',
      dataIndex: 'website',
      key: 'website',
    }, {
      title: '备注',
      dataIndex: 'memo',
      key: 'memo',
    }, {
      title: 'Action',
      key: 'action',
      render: (text, record) => (<span>
        <a href="javascript:;" onClick={() => { this.modify(record) }}>修改</a>
        <Divider type="vertical" />
        <a href="javascript:;" onClick={() => { this.handleDelete(record) }}>删除</a>
      </span>
      )

    }];

    const fields = this.state.fields;
    const operation = <Button onClick={this.Add}>新增</Button>;
    return (
      <Tabs tabBarExtraContent={operation} activeKey={this.state.activeKey} onChange={this.callback}>
        <TabPane tab={<span><Icon type="usergroup-add" />代理商列表</span>} key="1">
          <Table dataSource={this.state.data} columns={columns} rowKey={record => record.id}  bordered/>
        </TabPane>
        <TabPane tab={<span><Icon type="user-add" />代理商输入</span>} key="2">
          <ChannelForm modifyCustomerInfo={this.handleModifyCustomerInfo} {...fields} onChange={this.handleFormChange} />
        </TabPane>
      </Tabs>
    )
  }
}

const mapState = (state) => {
  const { customerId } = state.auth.user;
  return { customerId }
};

export const Channel = connect(mapState)(channel);