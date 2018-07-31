import React from 'react';
import { connect } from 'react-redux';
import {Table, Input, Button, Icon, notification } from 'antd';
import servers from '@/server'

export class material extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sourceData:[],
      data:[],
      filterDropdownVisible:false,
      searchText:'',
      nameFiltered:false,
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.getMaterial()
  }
  
  getMaterial() {
    let { customerId } = this.props;
    servers.showWarehouse({ customerId: customerId }).then(res => {
      console.log('res :',res);
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
  
  handleSearch() {
    const { searchText } = this.state;
    const reg = new RegExp(searchText, 'gi');
    this.setState({
      filterDropdownVisible: false,
      nameFiltered: !!searchText,
      data: this.state.sourceData.map((record) => {
        const match = record.deviceInfo && record.deviceInfo.materialName && record.deviceInfo.materialName.match(reg);
        if (!match) {
          return null;
        }
        return record;
      }).filter(record => !!record),
    });
  }
  
  handleInputChange(e) {
    this.setState({ searchText: e.target.value });
  }
  
  render() {
    const { data }= this.state;
    const columns = [{
      title: '物料',
      dataIndex: 'deviceInfo.materialName',
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
    },{
      title: '规格参数',
      dataIndex: 'deviceInfo.specification',
      key: 'specification',
      width: '15%',
    }, {
      title: '单位',
      dataIndex: 'deviceInfo.unit',
      key: 'unit',
      width: '10%',
    }, {
      title: '库存数量',
      dataIndex: 'quantity',
      key: 'quantity',
      width: '15%',
    },{
      title: '仓库',
      dataIndex: 'warehouse',
      key: 'warehouse',
      width: '15%',
    }];
    return (
      <React.Fragment>
        <h2 className="material-title">物料清单</h2>
        <Table columns={columns} dataSource={data} rowKey={record => record.id}/>
      </React.Fragment>
    )
  }
}
const mapState = (state) => {
  const { customerId } = state.auth.user;
  return { customerId }
};
export const Material = connect(mapState)(material);