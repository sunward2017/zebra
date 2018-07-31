import React from 'react';
import { Table, notification, Button, Row, Col, Card } from 'antd';
import servers from '@/server'
import RuleEdit from './RuleEdit'

export class Versions extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      data:[],
      detailData:[],
      addBtnFlag:false,
    };
    this.columns = [{
      title: '包名',
      dataIndex: 'packageName',
    },{
      title: '版本号',
      dataIndex: 'versionCode',
    },{
      title:'描述',
      dataIndex:'description',
    },{
      title:'更新方式',
      dataIndex:'upgradeWay',
    },{
      title:'操作者',
      dataIndex:'creator',
    },{
      title:'创建时间',
      dataIndex:'createTime'
    }];
    this.detailColumns = [{
      title: '设备编号',
      dataIndex: 'devSn',
    },{
      title: '斑马线名称',
      dataIndex: 'zebracrossingName',
    }];
  }
  
  componentDidMount() {
    this.fetchRuleList();
  }
  
  fetchRuleList = () => {
    const { customerId }= this.props;
    servers.getRoleList({customerId}).then(res => {
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
  
  handleOnRow = (roleId ) => {
    return {
      onClick: () => {
        console.log('click row');
        servers.getRoleDetail({roleId}).then(res => {
          console.log('detail:',res);
          if (res.result === 200) {
            res.data ? this.setState({ detailData: res.data }) : this.setState({ detailData: [] });
          } else {
            const args = {
              message: '获取详情失败',
              description: res.message,
              duration: 2,
            };
            notification.error(args);
          }
        }).catch(
          err => { console.log(err) }
        )
      }
    }
  }
  
  handleAddNewRule = () => {
    const { addBtnFlag } = this.state;
    if(addBtnFlag){
      this.fetchRuleList();
    }
    this.setState({
      addBtnFlag:!addBtnFlag,
    });
  }
  
  render() {
    const { data, detailData, addBtnFlag } = this.state;
    return (
      <React.Fragment>
        <h2 className="material-title">升级策略管理</h2>
        <Row>
          <Col span={18}>
            <Row>
              <Col span={3} offset={21}>
                <Button type="primary" size="large" icon="plus" style={{float:'right'}} onClick={this.handleAddNewRule}>新增规则</Button>
              </Col>
            </Row>
            <Table columns={this.columns} dataSource={data} rowKey={record => record.id} onRow={(record) => this.handleOnRow(record.id)}/>
          </Col>
          <Col span={5} offset={1}>
            <Card title="详情">
              <Table columns={this.detailColumns} dataSource={detailData} rowKey={record => record.id} />
            </Card>
          </Col>
        </Row>
        {
          addBtnFlag ? <RuleEdit onChange={this.handleAddNewRule} /> : null
        }
      </React.Fragment>
    )
  }
}