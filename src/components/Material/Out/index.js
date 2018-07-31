import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import {Table, Row, Col, Popconfirm, Input, DatePicker, Button, notification, Divider, Icon } from 'antd';
import PopupContainer from './PopupContainer'
import servers from '@/server'

const { RangePicker } = DatePicker;

class materialOut extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data:[],
      sourceData:[],
      filterDropdownVisible:false,
      searchText:'',
      nameFiltered:false,
      filterDate:'',
      newAddFlag:false,
      action:'',
      recordData:{},
      modalColumns : [{
        title: '物料名称',
        dataIndex: 'materialName',
        key: 'materialName',
      },{
        title:'单位名称',
        dataIndex:'unit',
        key:'unit',
        width:'15%',
      },{
        title: '出库数量',
        dataIndex: 'amount',
        key: 'amount',
        width:'25%',
      }],
    };
    this.getOutStockMaterialList()
  }
  
  getOutStockMaterialList = () => {
    let { customerId } = this.props;
    servers.getDeliveryOrderList({ customerId: customerId }).then(res => {
      if (res.result === 200) {
        res.data ? this.setState({ data: res.data,sourceData:res.data }) : this.setState({ data: [],sourceData:[] });
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
  
  handleRangePickerChange = (date, dateString) => {
    // console.log(date, dateString);
    if(date.length<1){
      this.setState({data:this.state.sourceData});
      return
    }
    this.setState({
      data:this.state.sourceData.map(record => {
        if(moment(record.orderTime).isBetween(...dateString,'second')) {
          return record;
        }
        return null;
      }).filter(record => !!record)
    })
  }
  
  handleInputChange= (e) => {
    this.setState({ searchText: e.target.value });
  }
  
  handleSearch = () => {
    const { searchText } = this.state;
    const reg = new RegExp(searchText, 'gi');
    this.setState({
      filterDropdownVisible: false,
      nameFiltered: !!searchText,
      data: this.state.sourceData.map((record) => {
        const match = record.companyName.match(reg);
        if (!match) {
          return null;
        }
        return {
          ...record,
          companyName: (
            <span>
              {record.companyName.split(new RegExp(`(?<=${searchText})|(?=${searchText})`, 'i')).map((text, i) => (
                text.toLowerCase() === searchText.toLowerCase()
                  ? <span key={i} className="highlight">{text}</span> : text // eslint-disable-line
              ))}
            </span>
          ),
        };
      }).filter(record => !!record),
    });
  }
  
  handleAddNewMaterial = () => {
    this.setState({
      newAddFlag:true,
      action:'edit',
      recordData:{}
    })
  }
  
  handleNewAddFlagChange = () => {
    this.setState({
      newAddFlag: !this.state.newAddFlag,
    });
  }
  
  handleCheck = (record) => {
    this.setState({
      action:'check',
      recordData:record,
      newAddFlag:true,
    })
  }
  
  handleModify = (record) => {
    this.setState({
      action:'edit',
      recordData:record,
      newAddFlag:true,
    })
  }
  
  handleRowDelete = (key) => {
    const { customerId } = this.props;
    const that = this;
    
    servers.deleteDeliveryOrderInfo({ customerId,id:key,status:0}).then(res => {
      if (res.result === 200) {
        notification.success({
          message: '成功提示',
          description: res.message,
        });
        that.getOutStockMaterialList();
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
  
  handleRead = (record) => {
    this.setState({
      action:'read',
      recordData:record,
      newAddFlag:true,
    })
  }
  
  render() {
    let { data, modalColumns, newAddFlag, recordData, action } = this.state;
    const dateFormat = 'YYYY-MM-DD';
    const columns = [{
      title: '出库单编号',
      dataIndex: 'deliveryOrderNo',
      key: 'deliveryOrderNo',
    }, {
      title: '公司名称',
      dataIndex: 'companyName',
      key: 'companyName',
      filterDropdown: (
        <div className="material-filter-dropdown">
          <Input
            ref={ele => this.searchInput = ele}
            value={this.state.searchText}
            onChange={this.handleInputChange}
            onPressEnter={this.handleSearch}
          />
          <Button type="primary" onClick={this.handleSearch}>搜索</Button>
        </div>
      ),
      filterIcon: <Icon type="search" style={{ color: this.state.nameFiltered ? '#108ee9' : '#aaa' }} />,
      filterDropdownVisible: this.state.filterDropdownVisible,
      onFilterDropdownVisibleChange: (visible) => {
        this.setState({
          filterDropdownVisible: visible,
        }, () => this.searchInput && this.searchInput.focus());
      }
    }, {
      title:'出库时间',
      dataIndex: 'orderTime',
      key: 'orderTime',
      render: (text,record) => record.orderTime && record.orderTime.split(' ')[0]
    },{
      title: '仓库',
      dataIndex: 'warehouse',
      key: 'warehouse',
      width: '10%',
    }, {
      title: '出库类型',
      dataIndex: 'deliveryType',
      key: 'deliveryType',
      width: '10%',
    },{
      title:'状态',
      dataIndex: 'status',
      key: 'status',
      width:'8%',
      filters: [
        { text: '已审核', value: 1 },
        { text: '待审核', value: 0 },
      ],
      onFilter: (value, record) => record.status === (value - 0),
      render: (text,record) => record.status=== 1 ? '已审核' : '待审核'
    }, {
      title: '操作者',
      dataIndex: 'operate',
      key: 'operate',
      width: '10%',
    },{
      title: '审核人',
      dataIndex: 'auditor',
      key: 'auditor',
      width: '10%',
    }, {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      width: '12%',
      render: (text, record) => {
        return (
          record.status === 0 ?
            <React.Fragment>
              <a href="javascript:;" onClick={() => { this.handleCheck(record) }}>审核</a>
              <Divider type="vertical" />
              <a href="javascript:;" onClick={() => { this.handleModify(record) }}>修改</a>
              <Divider type="vertical" />
              <Popconfirm title="确定删除?" onConfirm={() => this.handleRowDelete(record.id)}>
                <a href="javascript:;">删除</a>
              </Popconfirm>
            </React.Fragment> : <a href="javascript:;" onClick={() => { this.handleRead(record) }}>查看</a>
        );
      },
    }];
    return (
      <React.Fragment>
        
        <Row gutter={16} className="material-search">
          <Col span={6}>
            <RangePicker
             
              disabledDate={ current => current > new Date() }
              format={dateFormat}
              onChange={this.handleRangePickerChange}
            />
          </Col>
          <Col span={3} offset={15}>
            <Button type="primary"   icon="plus" onClick={this.handleAddNewMaterial}>新增出库单</Button>
          </Col>
        </Row>
        <Table columns={columns} dataSource={data} rowKey={record => record.id}/>
        {
          newAddFlag ?
            <PopupContainer
              onNewAddFlagChange={this.handleNewAddFlagChange}
              onGetNewData={this.getOutStockMaterialList}
              columns={modalColumns}
              recordData={recordData}
              action={action}
              customerId={this.props.customerId}
            /> : null
        }
      </React.Fragment>
    )
  }
}

const mapState = (state) => {
  const { customerId } = state.auth.user;
  return { customerId }
};
export const MaterialOut = connect(mapState)(materialOut);