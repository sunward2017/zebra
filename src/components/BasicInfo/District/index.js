import React from 'react';
import { connect } from 'react-redux';
import { Tree, Row, Col, Table, notification, Button, Input, Card, Popconfirm } from 'antd';
import servers from '@/server'
import EditableCell from './EditableCell'

const TreeNode = Tree.TreeNode;

class district extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      treeNodeData:[],
      nodeList:[],
      selectedNode:{},
      iptText:'',
      columns:[{
        title: '名称',
        dataIndex: 'cityName',
        key: 'cityName',
        render: (text,record) => (
          <EditableCell value={text} width="80%" onChange={this.handleIptText(record.id)} />
        )
      },{
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        width: '40%',
        render: (text, record) => {
          return (
            <Popconfirm title="确定删除?" onConfirm={() => this.handleRowDelete(record)}>
              <a href="javascript:;">删除</a>
            </Popconfirm>
          );
        },
      }]
    };
    this.getDistrictTree()
  }
  
  getDistrictTree = () => {
    const { customerId } = this.props;
    servers.getAreaInfoTree({ customerId: customerId}).then(res => {
      // console.log('tree res:',res);
      if (res.result === 200) {
        res.data ? this.setState({ treeNodeData: res.data.areaInfoList }) : this.setState({ treeNodeData: [] });
      } else {
        this.noticeErrInfo(res);
      }
    }).catch(
      err => { console.log(err) }
    )
  }
  
  getNodeList = (nodeData) => {
    // console.log('nodedata:',nodeData);
    servers.getAreaInfoList(nodeData).then(res => {
      // console.log('list data:',res);
      if (res.result === 200) {
        res.data ? this.setState({ nodeList: res.data }) : this.setState({ nodeList: [] });
      } else {
        this.noticeErrInfo(res);
      }
    }).catch(
      err => { console.log(err) }
    )
  }
  
  addNewDistrict = (data) => {
    const that = this;
    // console.log('add data:', data);
    const node = { id:data.pid, cityId:data.pCode, customerId:data.customerId};
    servers.modifyAreaInfo(data).then(res => {
      if (res.result === 200) {
        notification.success({
          message: '成功提示',
          description: res.message,
        });
        that.getDistrictTree();
        that.getNodeList(node);
      } else {
        this.noticeErrInfo(res);
      }
    }).catch(
      err => { console.log(err) }
    )
  }
  
  deleteDistrict = (data) => {
    const that = this;
    const { id, cityId, customerId } = this.state.selectedNode;
    servers.deleteAreaInfo(data).then(res => {
      if (res.result === 200) {
        notification.success({
          message: '成功提示',
          description: res.message,
        });
        that.getDistrictTree();
        that.getNodeList({ id, cityId, customerId });
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
  
  noticWarning = (text) => {
    notification.warning({
      message: '提示：',
      description: text,
    });
  }
  
  renderTreeNodes = (data) => {
    return data.map((item) => {
      if (item.areaInfoList) {
        return (
          <TreeNode title={item.cityName} key={item.id} dataRef={item}>
            {this.renderTreeNodes(item.areaInfoList)}
          </TreeNode>
        );
      }
      return <TreeNode title={item.cityName} key={item.id} dataRef={item}/>;
    });
  }
  
  handelTreeNodeSelect = (selectedKeys,info) => {
    // console.log("info:",info);
    if(!info.selected) return;
    this.setState({
      selectedNode:info.selectedNodes[0].props.dataRef,
      nodeList:info.selectedNodes[0].props.dataRef.areaInfoList || []
    })
  }
  
  handleInputChange = (e) => {
    this.setState({iptText: e.target.value});
  }
  
  handleIptText = (key) => {
    return (value) => {
      const { selectedNode } = this.state;
      let data = {
        id:key,
        cityName:value,
        customerId:selectedNode.customerId,
        pCode:selectedNode.cityId,
        pid:selectedNode.id,
        Action:1,
      };
      this.addNewDistrict(data);
    };
  }
  
  handleAddNewDistrict = () =>{
    const { selectedNode, iptText } = this.state;
    if(!selectedNode.id) {
      this.noticWarning('请先选择地区！');
      return
    }
    if(!iptText){
      this.noticWarning('请输入需要添加地区的名称！');
      return
    }
    let data = {
      cityName:iptText,
      customerId:selectedNode.customerId,
      pCode:selectedNode.cityId,
      pid:selectedNode.id,
      Action:0,
    };
    this.addNewDistrict(data);
  }
  
  handleRowDelete = (record) => {
    const { id, cityId, customerId } = record;
    this.deleteDistrict({ id, cityId, customerId });
  }
  
  render() {
    const { treeNodeData, iptText, nodeList, columns } = this.state;
    return (
      <Row gutter={16} style={{height:'600px',marginTop:'30px'}}>
        <Col span={5} className="overflow">
          <Card title="地区目录" style={{height:'100%'}}>
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
          <Input value={iptText} onChange={this.handleInputChange} style={{width:'200px',margin:'0 10px 10px'}} placeholder="在选中的地区下增加"/>
          <Button type="primary" onClick={this.handleAddNewDistrict}>新增</Button>
          <Table columns={columns} dataSource={nodeList} bordered rowKey={record => record.id} />
        </Col>
      </Row>
    )
  }
}
const mapState = (state) => {
  const { customerId } = state.auth.user;
  return { customerId }
};
export const District = connect(mapState)(district);