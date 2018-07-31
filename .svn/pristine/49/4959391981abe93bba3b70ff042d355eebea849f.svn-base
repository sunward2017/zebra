import React from 'react';
import { connect } from 'react-redux';
import { Tree, Row, Col, Table, notification, Button, Input, Card, Popconfirm, Divider, Switch } from 'antd';
import servers from '@/server'
import EditableCell from '../District/EditableCell'
import EditModal from './EditModal'

const TreeNode = Tree.TreeNode;

class materialBill extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      treeNodeData:[],
      typeList:[],
      selectedNode:{},
      iptText:'',
      columns:[{
        title: '名称',
        dataIndex: 'typeName',
        key: 'typeName',
        render: (text,record) => (
          <EditableCell value={text} width="80%" onChange={this.handleIptText(record.id)} />
        )
      },{
        title:'是否启用',
        dataIndex:'state',
        key:'state',
        width: '20%',
        render:(text,record) => {
          return (
            <Switch checked={text === 1} onChange={ (checked) => this.switchTypeChange(record,checked) } />
          )
        }
      },{
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        width: '20%',
        render: (text, record) => {
          return (
            <Popconfirm title="确定删除?" onConfirm={() => this.handleRowDelete(record)}>
              <a href="javascript:;">删除</a>
            </Popconfirm>
          );
        },
      }],
      infoColumns:[{
        title:'物料名称',
        dataIndex:'materialName',
        key:'materialName',
      },{
        title:'单位名称',
        dataIndex:'unit',
        key:'unit',
      },{
        title:'型号',
        dataIndex:'model',
        key:'model'
      },{
        title:'规格',
        dataIndex:'specification',
        key:'specification'
      },{
        title:'备注',
        dataIndex:'memo',
        key:'memo',
        width: '20%',
      },{
        title:'是否启用',
        dataIndex:'state',
        key:'state',
        width: '10%',
        render:(text,record) => {
          return (
            <Switch checked={text === 1} onChange={ (checked) => this.switchDeviceInfoChange(record,checked) } />
          )
        }
      },{
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        width: '15%',
        render: (text, record) => {
          return (
            <React.Fragment>
              <a href="javascript:;" onClick={() => this.handleModify(record) }>修改</a>
              <Divider type="vertical" />
              <Popconfirm title="确定删除?" onConfirm={() => this.handleRowDeviceDelete(record)}>
                <a href="javascript:;">删除</a>
              </Popconfirm>
            </React.Fragment>
          );
        },
      }],
      deviceList:[],
      addBtnFlag:false,
      action:'',
      editRecord:{}
    };
    this.getDeviceTypeTree()
  }
  
  getDeviceTypeTree = () => {
    const { customerId } = this.props;
    servers.getDeviceTypeTree({ customerId: customerId}).then(res => {
      console.log('tree res:',res);
      if (res.result === 200) {
        res.data ? this.setState({ treeNodeData: res.data.child }) : this.setState({ treeNodeData: [] });
      } else {
        this.noticeErrInfo(res);
      }
    }).catch(
      err => { console.log(err) }
    )
  }
  
  getTypeList = (nodeData) => {
    // console.log('nodedata:',nodeData);
    servers.getDeviceTypeList(nodeData).then(res => {
      console.log('list data:',res);
      if (res.result === 200) {
        res.data ? this.setState({ typeList: res.data }) : this.setState({ typeList: [] });
      } else {
        this.noticeErrInfo(res);
      }
    }).catch(
      err => { console.log(err) }
    )
  }
  
  addNewDeviceType = (data) => {
    const that = this;
    console.log('add data:', data);
    servers.modifyDeviceType(data).then(res => {
      if (res.result === 200) {
        notification.success({
          message: '成功提示',
          description: res.message,
        });
        that.getDeviceTypeTree();
        that.getTypeList({id:data.pid,customerId:data.customerId});
      } else {
        this.noticeErrInfo(res);
      }
    }).catch(
      err => { console.log(err) }
    )
  }
  
  deleteDeviceType = (data) => {
    console.log('delete data:',data);
    const that = this;
    const { id, customerId } = this.state.selectedNode;
    servers.deleteDeviceType(data).then(res => {
      if (res.result === 200) {
        notification.success({
          message: '成功提示',
          description: res.message,
        });
        that.getDeviceTypeTree();
        that.getTypeList({ id, customerId });
      } else {
        this.noticeErrInfo(res);
      }
    }).catch(
      err => { console.log(err) }
    )
  };
  
  noticeErrInfo = (res) => {
    const args = {
      message: '通信失败',
      description: res.message,
      duration: 2,
    };
    notification.error(args);
  }
  
  noticWarning = (text) => {
    notification.warning({
      message: '提示：',
      description: text,
    });
  }
  
  renderTreeNodes = (data) => {
    return data.map((item) => {
      if (item.child) {
        return (
          <TreeNode title={item.typeName} key={item.id} dataRef={item}>
            {this.renderTreeNodes(item.child)}
          </TreeNode>
        );
      }
      return <TreeNode title={item.typeName} key={item.id} dataRef={item}/>;
    });
  }
  
  handelTreeNodeSelect = (selectedKeys,info) => {
    // console.log("info:",info);
    if(!info.selected) return;
    const node = info.selectedNodes[0].props.dataRef;
    this.setState({
      selectedNode:node,
    });
    this.getTypeList({customerId:node.customerId, id:node.id});
    this.getDeviceList({customerId:node.customerId,typeCode:node.typeCode});
  }
  
  handleInputTypeChange = (e) => {
    this.setState({iptText: e.target.value});
  }
  
  handleIptText = (key) => {
    return (value) => {
      const { selectedNode } = this.state;
      let data = {
        id:key,
        typeName:value,
        customerId:selectedNode.customerId,
        pid:selectedNode.id,
        Action:1,
      };
      this.addNewDeviceType(data);
    };
  }
  
  handleAddNewDeviceType = () =>{
    const { selectedNode, iptText, treeNodeData } = this.state;
    const { customerId } = this.props;
    if(!selectedNode.id && treeNodeData.length>0) {
      this.noticWarning('请选择一个需要增加子类别的对象！');
      return
    }
    if(!iptText){
      this.noticWarning('请输入需要新增的类别名称！');
      return
    }
    let data = {
      typeName:iptText,
      customerId,
      pid:selectedNode.id || 0,
      Action:0,
    };
    this.addNewDeviceType(data);
  }
  
  handleRowDelete = (record) => {
    const { id, typeCode, customerId } = record;
    this.deleteDeviceType({ id, typeCode, customerId });
  }
  
  switchTypeChange = (record,checked) => {
    record.Action = 1;
    record.state = checked ? 1 : 0;
    this.addNewDeviceType(record);
  }
  
  /*device info*/
  getDeviceList = (nodeData) => {
    servers.getDeviceInfoList(nodeData).then(res => {
      console.log('device list res:',res);
      if (res.result === 200) {
        res.data ? this.setState({ deviceList: res.data }) : this.setState({ deviceList: [] });
      } else {
        this.noticeErrInfo(res);
      }
    }).catch(
      err => { console.log(err) }
    )
  }
  
  addNewDevice = (data) => {
    const that = this;
    console.log('new device data:', data);
    const { typeCode, customerId } = this.state.selectedNode;
    servers.modifyDeviceInfo(data).then(res => {
      // console.log('new device res:',res);
      if (res.result === 200) {
        notification.success({
          message: '成功提示',
          description: res.message,
        });
        that.getDeviceList({customerId,typeCode});
      } else {
        this.noticeErrInfo(res);
      }
    }).catch(
      err => { console.log(err) }
    )
  }
  
  deleteDevice = (data) => {
    console.log('delete data:',data);
    const that = this;
    const { typeCode, customerId } = this.state.selectedNode;
    servers.deleteDeviceInfo(data).then(res => {
      if (res.result === 200) {
        notification.success({
          message: '成功提示',
          description: res.message,
        });
        that.getDeviceList({ typeCode, customerId });
      } else {
        this.noticeErrInfo(res);
      }
    }).catch(
      err => { console.log(err) }
    )
  };
  
  handleAddNewDevice = () => {
    if(!this.state.selectedNode.id) {
      this.noticWarning('请先选择左侧的类别再添加！');
      return
    }
    this.setState({
      action:'',
      addBtnFlag:true
    })
  }
  
  handleChangeDeviceModal = () => {
    return (res) => {
      this.setState({
        addBtnFlag:false
      });
      // console.log('edit res:',res);
      if(res){
        let data = res;
        if(res.id){
          data.Action = 1;
        }else {
          const { customerId, id } = this.state.selectedNode;
          data.Action = 0;
          data.typeId = id;
          data.state = 1; //新增默认启用
          data.customerId = customerId;
        }
        this.addNewDevice(data)
      }
    }
  }
  
  handleModify = (record) => {
    this.setState({
      action:'modify',
      addBtnFlag:true,
      editRecord:record,
    })
  }
  
  handleRowDeviceDelete = (record) => {
    const { id, customerId } = record;
    this.deleteDevice({ id, customerId });
  }
  
  switchDeviceInfoChange = (record,checked) => {
    console.log('checked:',checked);
    record.Action = 1;
    record.state = checked ? 1 : 0;
    this.addNewDevice(record);
  }
  
  render() {
    const { treeNodeData, iptText, typeList, columns, infoColumns, deviceList, addBtnFlag, action, editRecord } = this.state;
    return (
      <Row gutter={16} style={{height:'600px',marginTop:'30px'}}>
        <Col span={5} className="overflow">
          <Card title="物料设备分类目录" style={{height:'100%'}}>
            <Tree
              defaultExpandAll={true}
              onSelect={this.handelTreeNodeSelect}
            >
              {
                this.renderTreeNodes(treeNodeData)
              }
            </Tree>
          </Card>
        </Col>
        <Col span={19}>
          <Divider orientation="left">物料设备分类目录编辑</Divider>
          <Input value={iptText} onChange={this.handleInputTypeChange} style={{width:'200px',margin:'0 10px 10px'}} placeholder="在选中的分类下增加子分类"/>
          <Button type="primary" onClick={this.handleAddNewDeviceType}>新增</Button>
          <Table columns={columns} dataSource={typeList} bordered rowKey={record => record.id} scroll={{ y: 120 }} pagination={false}/>
          <Divider orientation="left">物料设备详情列表</Divider>
          <Button type="primary" style={{marginBottom:'10px'}} onClick={this.handleAddNewDevice}> 添加物料设备 </Button>
          <Table columns={infoColumns} dataSource={deviceList} bordered rowKey={record => record.id} />
        </Col>
        {
          addBtnFlag ?
            <EditModal
              record={ action === 'modify' ? editRecord : {} }
              onChange={this.handleChangeDeviceModal() }
            /> : null
        }
      </Row>
    )
  }
}
const mapState = (state) => {
  const { customerId } = state.auth.user;
  return { customerId }
};
export const MaterialBill = connect(mapState)(materialBill);