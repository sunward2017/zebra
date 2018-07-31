import React from 'react';
import { Tree, Row, Col, Table, notification, Icon, Modal, Card } from 'antd';
import servers from '@/server'

const TreeNode = Tree.TreeNode;

export default class MaterialModal extends React.Component {
  constructor(props) {
    super(props);
    let columns = [...this.props.columns];
    columns.pop();
    this.state = {
      columns,
      data:[],
      treeNodeData:[],
      selectedNode:{},
      selectedRowKeys:[],
      selectedRows:[],
      selectedNum:0,
    };
    this.fetchTreeNodeData();
  }
  
  componentWillUnmount() {
    console.log('modal unmount......')
  }
  
  fetchTreeNodeData = () => {
    let { customerId } = this.props;
    servers.getDeviceTypeTree({ customerId: customerId }).then(res => {
      if (res.result == 200) {
        res.data ? this.setState({ treeNodeData: res.data.child }) : this.setState({ treeNodeData: [] });
      } else {
        this.noticeErrInfo(res);
      }
    }).catch(
      err => { console.log(err) }
    )
  }
  
  getDeviceList = (nodeData) => {
    servers.getDeviceInfoList(nodeData).then(res => {
      console.log('device list res:',res);
      if (res.result === 200) {
        res.data ? this.setState({ data: res.data }) : this.setState({ data: [] });
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
  
  renderTreeNodes = (data) => {
    return data.map((item) => {
      if (item.child) {
        return (
          <TreeNode title={item.typeName} key={item.id} dataRef={item} icon={({ selected }) => (
            <Icon type={selected ? 'frown' : 'frown-o'} />
          )}>
            {this.renderTreeNodes(item.child)}
          </TreeNode>
        );
      }
      return <TreeNode title={item.typeName} key={item.id} dataRef={item} />;
    });
  }
  
  computeSelectedRows = () => {
    let { selectedRows, selectedRowKeys } = this.state;
    let result = selectedRowKeys.map( key => {
      for(let row of selectedRows) {
        if(row.id === key) {
          return row;
        }
      }
    });
    console.log('result:',result);
    return result;
  }
  
  handelTreeNodeSelect = (selectedKeys, info) => {
    console.log('selected', selectedKeys, info);
    if(!info.selected) return;
    const node = info.selectedNodes[0].props.dataRef;
    this.setState({
      selectedNode:node,
    });
    this.getDeviceList({customerId:node.customerId,typeCode:node.typeCode});
  }
  
  handleMaterialSelectChange = (selectedRowKeys,rows) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys,'rows:',rows);
    let { selectedRows } = this.state;
    this.setState({
      selectedRowKeys,
      selectedRows:selectedRows.concat(rows),
      selectedNum:selectedRowKeys.length,
    })
  }
  
  handleOk = () => {
    const { selectedRowKeys } = this.state;
    if(selectedRowKeys.length<=0){
      notification.warning({
        message: '提示：',
        description: '未选中任何物料！',
      });
      return
    }
    const selectedMaterial = this.computeSelectedRows();
    this.props.onOk(selectedMaterial);
  }
  
  handleCancel = () => {
    this.props.onCancel();
  }
  
  render() {
    const { treeNodeData, selectedNum, selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.handleMaterialSelectChange,
    };
    return (
      <Modal
        title="选物料"
        width="70%"
        visible={this.props.visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
      >
        <Row gutter={16} className="popup-height">
          <Col span={6} style={{height:'100%'}}>
            <Card title="物料设备类别" style={{height:'100%',overflow:'auto'}}>
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
          <Col span={18}>
            <span> 当前已选:{selectedNum} </span>
            <Table rowSelection={rowSelection} columns={this.state.columns} dataSource={this.state.data} bordered rowKey={record => record.id} scroll={{ y: 230 }}/>
          </Col>
        </Row>
      </Modal>
    )
  }
}