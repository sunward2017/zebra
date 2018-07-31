import React from 'react';
import { connect } from 'react-redux';
import { Tree, Row, Col, Table, notification, Button, Card, Popconfirm, Divider, Select } from 'antd';
import servers from '@/server'
import CrossingEdit from '../Crossing/CrossingEdit'

const TreeNode = Tree.TreeNode;
const Option = Select.Option;

class zebraCrossing extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      treeNodeData:[],
      crossingList:[],
      zebraCrossingList:[],
      selectedDistrict:{},
      selectedCrossing:{},
      columns:[{
        title: '斑马线',
        dataIndex: 'zebracrossingName',
        key: 'zebracrossingName',
      },{
        title: '地址',
        dataIndex: 'address',
        key: 'address',
      },{
        title: '经度',
        dataIndex: 'longitude',
        key: 'longitude',
        width:'10%',
      },{
        title: '维度',
        dataIndex: 'latitude',
        key: 'latitude',
        width:'10%',
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
      editRecord:{},
      initIptVal:''
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
  };

  getCrossingList = (nodeData) => {
    console.log('road',nodeData)
    servers.getRoadSetInfoList(nodeData).then(res => {
      // console.log('list data:',res);
      if (res.result === 200) {
        res.data ? this.setState({ crossingList: res.data }) : this.setState({ crossingList: [] });
      } else {
        this.noticeErrInfo(res);
      }
    }).catch(
      err => { console.log(err) }
    )
  };

  getZebraCrossingList = (data) => {
    servers.getBanMaLineListinfo(data).then(res => {
      console.log('zebra list data:',res);
      if (res.result === 200) {
        res.data ? this.setState({ zebraCrossingList: res.data }) : this.setState({ zebraCrossingList: [] });
      } else {
        this.noticeErrInfo(res);
      }
    }).catch(
      err => { console.log(err) }
    )
  };
  
  addNewZebraCrossing = (data) => {
    const that = this;
    // console.log('add data:', data);
    servers.modifyBanMaLineInfo(data).then(res => {
      if (res.result === 200) {
        notification.success({
          message: '成功提示',
          description: res.message,
        });
        that.getZebraCrossingList({customerId:data.customerId,roadId:data.roadId});
      } else {
        this.noticeErrInfo(res);
      }
    }).catch(
      err => { console.log(err) }
    )
  }
  
  deleteZebraCrossing = (data) => {
    const that = this;
    // console.log('delete data:',data);
    const { id, customerId} = this.state.selectedCrossing;
    servers.deleteBanMaLineInfo(data).then(res => {
      if (res.result === 200) {
        notification.success({
          message: '成功提示',
          description: res.message,
        });
        that.getZebraCrossingList({customerId,roadId:id});
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
  
  noticeWarning = (text) => {
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
      return <TreeNode title={item.cityName} key={item.id} dataRef={item} />;
    });
  }
  
  handelTreeNodeSelect = (selectedKeys,info) => {
    if(!info.selected) return;
    const node = info.selectedNodes[0].props.dataRef;
    // console.log('node:',node);
    this.setState({
      selectedDistrict:node,
    });
    this.getCrossingList({customerId:node.customerId, id:node.id, areaId:node.cityId});
  }
  
  handleCrossingChange = (option) => {
    if(!option) return;
    const data = JSON.parse(option);
    this.setState({
      selectedCrossing:data,
    });
    this.getZebraCrossingList({roadId:data.id, customerId:data.customerId});
 }
  
  handleAddNewZebraCrossing = () => {
    if(!this.state.selectedDistrict.id) {
      this.noticeWarning('请选择地区和路口后再添加斑马线！');
      return
    }
    if(!this.state.selectedCrossing.id) {
      this.noticeWarning('请选择要添加斑马线的路口！');
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
    this.deleteZebraCrossing({ id });
  }
  
  handleChangeZebraCrossing = () => {
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
          const { id, customerId } = this.state.selectedCrossing;
          data.Action = 0;
          data.roadId = id;
          data.customerId = customerId;
        }
        this.addNewZebraCrossing(data)
      }
    }
  }
  
  render() {
    const { treeNodeData, crossingList, zebraCrossingList, columns, addBtnFlag, action, editRecord } = this.state;
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
          <Select
            showSearch
            style={{ width: 300 ,marginRight:10}}
            placeholder="选择要添加斑马线的路口"
            optionFilterProp="children"
            onChange={this.handleCrossingChange}
            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
          >
            {
              crossingList.map(item => <Option value={JSON.stringify(item)} key={item.id}>{item.roadName}</Option>)
            }
          </Select>
          <Button type="primary" style={{marginBottom:'10px'}} onClick={this.handleAddNewZebraCrossing}> 添加斑马线信息 </Button>
          <Table columns={columns} dataSource={zebraCrossingList} bordered rowKey={record => record.id} />
          {
            addBtnFlag ?
              <CrossingEdit
                record={ action === 'modify' ? editRecord : {} }
                onChange={this.handleChangeZebraCrossing() }
                zebra="zebra"
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
export const ZebraCrossing = connect(mapState)(zebraCrossing);