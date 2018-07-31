import React from 'react';
import { connect } from 'react-redux';
import { Tree, Row, Col, Table, notification, Button, Card, Popconfirm, Divider } from 'antd';
import servers from '@/server'
import CrossingEdit from './CrossingEdit'

const TreeNode = Tree.TreeNode;

class crossing extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      treeNodeData:[],
      crossingList:[],
      selectedNode:{},
      columns:[{
        title: '名称',
        dataIndex: 'roadName',
        key: 'roadName',
      },{
        title: '地址',
        dataIndex: 'address',
        key: 'address',
      },{
        title: '经度',
        dataIndex: 'longitude',
        key: 'longitude',
      },{
        title: '维度',
        dataIndex: 'latitude',
        key: 'latitude',
      },{
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        width: '15%',
        render: (text, record) => {
          return (
            <React.Fragment>
              <a href="javascript:;" onClick={() => { this.handleModify(record) }}>修改</a>
              <Divider type="vertical" />
              <Popconfirm title="确定删除?" onConfirm={() => this.handleRowDelete(record)}>
                <a href="javascript:;">删除</a>
              </Popconfirm>
            </React.Fragment>
          );
        },
      }],
      addBtnFlag:false,
      action:'',
      editRecord:{}
    };
    this.getDistrictTree();
  }
  
  getDistrictTree = () => {
    let { customerId } = this.props;
    servers.getAreaInfoTree({ customerId: customerId}).then(res => {
      if (res.result === 200) {
        res.data ? this.setState({ treeNodeData: res.data.areaInfoList }) : this.setState({ treeNodeData: [] });
      } else {
        this.noticeErrInfo(res);
      }
    }).catch(
      err => { console.log(err) }
    )
  }
  
  getCrossingList = (nodeData) => {
    servers.getRoadSetInfoList(nodeData).then(res => {
      console.log('list data:',res);
      if (res.result === 200) {
        res.data ? this.setState({ crossingList: res.data }) : this.setState({ crossingList: [] });
      } else {
        this.noticeErrInfo(res);
      }
    }).catch(
      err => { console.log(err) }
    )
  }
  
  addNewCrossing = (data) => {
    const that = this;
    // console.log('add data:', data);
    const { id, cityId, customerId} = this.state.selectedNode;
    servers.modifyRoadSetInfo(data).then(res => {
      if (res.result === 200) {
        notification.success({
          message: '成功提示',
          description: res.message,
        });
        that.getCrossingList({id,customerId,areaId:cityId});
      } else {
        this.noticeErrInfo(res);
      }
    }).catch(
      err => { console.log(err) }
    )
  }
  
  deleteCrossing = (data) => {
    const that = this;
    const { id, cityId, customerId} = this.state.selectedNode;
    servers.deleteRoadSetInfo(data).then(res => {
      if (res.result === 200) {
        notification.success({
          message: '成功提示',
          description: res.message,
        });
        that.getCrossingList({id,customerId,areaId:cityId});
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
  
  componentWillUnmount() {
    console.log('district unmount......')
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
      return <TreeNode title={item.cityName} key={item.id} dataRef={item} />;
    });
  }
  
  handelTreeNodeSelect = (selectedKeys,info) => {
    if(!info.selected) return;
    const node = info.selectedNodes[0].props.dataRef;
    console.log('node:',node);
    this.setState({
      selectedNode:node,
    });
    this.getCrossingList({customerId:node.customerId, id:node.id, areaId:node.cityId});
  }
  
  handleAddNewCrossing = () => {
    if(!this.state.selectedNode.id) {
      this.noticWarning('请先选择地区再添加路口！');
      return
    }
    this.setState({
      action:'',
      addBtnFlag:true
    })
  }
  
  handleModify = (record) => {
    this.setState({
      action:'modify',
      addBtnFlag:true,
      editRecord:record,
    })
  }
  
  handleRowDelete = (record) => {
    const { id, customerId } = record;
    this.deleteCrossing({ id, customerId });
  }
  
  handleChangeCrossing = () => {
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
          const { cityId, customerId } = this.state.selectedNode;
          data.Action = 0;
          data.areaId = cityId;
          data.customerId = customerId;
        }
        this.addNewCrossing(data)
      }
    }
  }
  
  render() {
    const { treeNodeData, crossingList, columns, addBtnFlag, action, editRecord } = this.state;
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
          <Button type="primary" style={{marginBottom:'10px'}} onClick={this.handleAddNewCrossing}> 添加路口信息 </Button>
          <Table columns={columns} dataSource={crossingList} bordered rowKey={record => record.id} />
          {
            addBtnFlag ?
              <CrossingEdit
                record={ action === 'modify' ? editRecord : {} }
                onChange={this.handleChangeCrossing() }
              /> : null
          }
        </Col>
      </Row>
    )
  }
}
const mapState = (state) => {
  const { customerId } = state.auth.user;
  return { customerId }
};
export const Crossing = connect(mapState)(crossing);