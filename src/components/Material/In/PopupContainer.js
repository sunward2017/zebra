import React from 'react';
import { Modal, Row, Col, Button, Table, DatePicker, Input, notification, Select } from 'antd'
import moment from 'moment';
import servers from '@/server'
import MaterialModal from './MaterialModal'
import urls from '../../../server/url'
const Option = Select.Option;

export default class PopupContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible:false,
      addFromSourceFlag:false,
      data:{detailList:[]},
      systemParam:[],
    };
    this.handleOk = this.handleOk.bind(this);
    this.handleCancel =this.props.onNewAddFlagChange;
    this.handleAddFromSource = this.handleAddFromSource.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleAddDetailList = this.handleAddDetailList.bind(this);
    this.fetchSystemParam();
    console.log('record data:',this.props.recordData);
  }
  
  initialize() {
    const { action } = this.props;
    let columns = [...this.props.columns];
    if(action === 'edit'){
      console.log('action:',action);
      columns[columns.length-1].render = (text,record) => (
        <Input value={text} onChange={(e) => this.handleAmount(record.id, 'amount',e)} style={{width:'80%'}}/>
      );
      columns.push({
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        width: '12%',
        render:(text,record) => {
          return <Button shape="circle" icon="delete" onClick={() => this.handleDelete(record.id)}/>
        }
      });
    }else {
      columns[columns.length - 1].render = (text,record) => text;
    }
    this.setState({
      columns,
      data:Object.assign({detailList:[],orderTime:new Date()},JSON.parse(JSON.stringify(this.props.recordData))),
    })
  }
  
  static getDerivedStateFromProps(nextProps, prevState) {
    return {
      visible:nextProps.newAddFlag,
    }
  }
  
  componentDidMount () {
    this.initialize();
  }
  
  componentWillUnmount() {
    console.log('popup unmount......')
  }
  
  fetchSystemParam() {
    servers.getSystemParam({}).then(res => {
      if (res.result === 200) {
        // console.log('systemParam:',res);
        this.setState({ systemParam: res.data }) ;
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
  
  handleIptText(target,e) {
    let data = Object.assign({},this.state.data);
    data[target] = e.target.value;
    this.setState({data});
  }
  
  handleSelectOption = (target,value) => {
    let data = Object.assign({},this.state.data);
    data[target] = value;
    this.setState({data});
  }
  
  handleAddFromSource() {
    this.setState({
      addFromSourceFlag:!this.state.addFromSourceFlag
    })
  }
  
  handleAddDetailList(lists) {
    let data = this.state.data;
    data.detailList.unshift(...lists);
    console.log('detatl list',data);
    this.setState({
      data,
      addFromSourceFlag:!this.state.addFromSourceFlag
    });
  }
  
  handleAmount = (key, dataIndex,e) => {
    const value = e.target.value;
    const reg =/^\d*$/;
    if(value<0 || !reg.test(value) ) return;
    let data = this.state.data;
    let target = data.detailList.find(item => item.id === key);
    if (target) {
      target[dataIndex] = Number(value);
      this.setState({ data });
    }
  }
  
  handleDelete(key) {
    let data = this.state.data;
    data.detailList = data.detailList.filter(item => item.id !== key);
    this.setState({ data });
  }
  
  handleOk(e) {
    const { action } = this.props;
    if(action === 'edit'){
      const { companyName, operate, orderTime, warehouse } = this.state.data;
      if( !(companyName && operate && orderTime && warehouse)) {
        notification.warning({
          message: '提示：',
          description: '单据存在数据未填的情况，请仔细核对！',
        });
        return false
      }
    }
    if(action !== 'read'){
      this.fetchPost();
    }else {
      this.handleCancel();
    }
  }
  
  regTest (value) {
    const reg = new RegExp("^[ ]+$");
    return reg.test(value);
  }
  
  fetchPost() {
    const that = this;
    let { data } = this.state;
    let url = urls.insertGodownEntryMain;
    if(data.id){
      if(this.props.action === 'check'){
        /*if(!data.auditor || this.regTest(data.auditor)){
          notification.warning({
            message: '提示：',
            description: '请填写审核人信息！',
          });
          return
        }*/
        data = { id:data.id, customerId:data.customerId};
        // url = urls.confirmWarehousing;
        this.confirmPost(data);
        return;
      }else {
        url = urls.modifyGodownEntryMain;
      }
    }else {
      const { customerId } = this.props;
      data.customerId = customerId;
    }
    data = this.formatListId(data);
    console.log('post data:',data);
    let request = new Request(url, {
      body: JSON.stringify(data),
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json;charset=utf-8'
      })
    });
    fetch(request).then(resp => resp.json()).then( res => {
      console.log('res:',res);
      if (res.result === 200) {
        notification.success({
          message: '通信成功',
          description: res.message,
        });
        that.props.onGetNewData();
        that.handleCancel();
      } else {
        const args = {
          message: '通信失败',
          description: res.message,
          duration: 2,
        };
        notification.error(args);
      }
    }).catch(err => { console.log(err) });
  }
  
  confirmPost = (data) => {
    const that = this;
    servers.confirmWarehousing(data).then(res => {
      if (res.result === 200) {
        notification.success({
          message: '通信成功',
          description: res.message,
        });
        that.props.onGetNewData();
        that.handleCancel();
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
  
  formatListId = (data) => {
    data.detailList =  data.detailList.map(item => {
      const {id, ...ret } = item;
      // console.log('ret:',ret);
      return ret;
    });
    return data;
  }
  
  render() {
    const { action, customerId, title } = this.props;
    const { addFromSourceFlag, systemParam, visible, columns } = this.state;
    const { companyName, warehouse, operate, orderTime, auditor, detailList, type } = this.state.data;
    const disable = action !== 'edit';
    return (
      <Modal
        title={title+'单'}
        width="75%"
        visible={visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
      >
        <Row className="margin-b">
          <Col span={5}>{title}单位：<Input className="material-in-ipt" value={companyName} onChange={(e) => this.handleIptText('companyName',e)} disabled={disable}/></Col>
          <Col span={5}>仓库：
            <Select onChange={(value) => this.handleSelectOption('warehouse',value)} value={ warehouse } disabled={disable} className="material-in-ipt">
              {
                systemParam[2] && systemParam[2].paramValue.split(',').map((item ,idx)=> <Option value={item} key={idx}>{item}</Option> )
              }
            </Select>
          </Col>
          <Col span={5}>{title}类型：
            <Select onChange={(value) => this.handleSelectOption('type',value)} value={ type } disabled={disable} style={{width:120}}>
              {
                systemParam[3] && systemParam[3].paramValue.split(',').map((item ,idx)=> <Option value={item} key={idx}>{item}</Option> )
              }
            </Select>
          </Col>
          <Col span={4}>操作员：<Input style={{width:100}} value={operate} onChange={(e) => this.handleIptText('operate',e)} disabled={disable}/></Col>
          <Col span={5}>日期：<DatePicker format='YYYY-MM-DD' value={ moment(orderTime,'YYYY-MM-DD') } onChange={(e) => this.handleIptText('orderTime',e)} disabled={disable}/></Col>
        </Row>
        {
          action === 'edit' ?
            <Button type="primary" icon="plus" onClick={this.handleAddFromSource} className="margin-b">添加物料</Button> :
            <div className="margin-b">审核人：<Input className="material-in-ipt" value={auditor} onChange={(e) => this.handleIptText('auditor',e)} disabled={action !== 'check'}/></div>
        }
        <Table columns={columns} dataSource={detailList} bordered rowKey={record => record.id} scroll={{ y: 300 }} pagination={false}/>
        {
          addFromSourceFlag ?
            <MaterialModal
              visible={addFromSourceFlag}
              columns={this.props.columns}
              customerId={customerId}
              onCancel={this.handleAddFromSource}
              onOk={this.handleAddDetailList}
            /> : null
        }
      </Modal>
    )
  }
}