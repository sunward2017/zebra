import React from 'react';
import { Modal, Button, Input, Form, Table, notification, Row, Col, Select } from 'antd';
import servers from '@/server'
import urls from '../../../server/url'

const Option = Select.Option;

class VersionEdit extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      data:[],
      selectedRows:[],
      versionList:[],
    };
    this.columns = [{
      title: '设备编号',
      dataIndex: 'devSn',
    },{
      title: '斑马线名称',
      dataIndex: 'zebracrossingName ',
      width:'40%',
    }];
  }
  
  componentDidMount() {
    this.fetchDevList();
    this.fetchVersionList();
  }
  
  fetchDevList = () => {
    servers.getDevList().then(res => {
      // console.log('devlist data:',res);
      if (res.result === 200) {
        res.data ? this.setState({ data: res.data }) : this.setState({ data: [] });
      } else {
        this.noticeErrInfo(res);
      }
    }).catch(
      err => { console.log(err) }
    )
  }
  
  fetchVersionList = () => {
    servers.getVerInfoList().then(res => {
      if (res.result === 200) {
        res.data ? this.setState({ versionList: res.data }) : this.setState({ versionList: [] });
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
  
  handleDevSelectChange = (selectedRowKeys,rows) => {
    // console.log('selectedRowKeys changed: ', selectedRowKeys,'rows:',rows);
    this.setState({
      selectedRows:rows.map( item => {
        const { devSn } = item;
        return { devSn }
      }),
    })
  }
  
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const that = this;
        values.versionCode = JSON.parse(values.versionCode).versionCode;
        values.child = this.state.selectedRows;
        // console.log('values:',values);
        let request = new Request(urls.setRole, {
          body: JSON.stringify(values),
          method: 'POST',
          headers: new Headers({
            'Content-Type': 'application/json;charset=utf-8'
          })
        });
        fetch(request).then(resp => resp.json()).then( res => {
          // console.log('res:',res);
          if (res.result === 200) {
            notification.success({
              message: '新增成功!',
              description: res.message,
            });
            that.props.onChange();
          } else {
            this.noticeErrInfo(res);
          }
        }).catch(err => { console.log(err) });
      }
    });
  }
  
  handleCancel = () => {
    this.props.onChange();
  }
  
  render () {
    const { getFieldDecorator } = this.props.form;
    const { data, versionList } = this.state;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 16,
          offset:10,
        },
      },
    };
    const rowSelection = {
      onChange: this.handleDevSelectChange,
    };
    return (
      <Modal title="规则编辑" visible={true} onCancel={this.handleCancel} footer={null} width="60%">
        <Row>
          <Col span={12}>
            <Form onSubmit={this.handleSubmit}>
              <Form.Item label="版本号" {...formItemLayout}>
                {getFieldDecorator('versionCode', {
                  rules: [{
                    required: true, message: '请选择版本号!',
                  }],
                })(
                  <Select>
                    {versionList.map(v => <Option key={v.id} value={JSON.stringify(v)}>{v.versionCode}</Option>)}
                  </Select>
                )}
              </Form.Item>
              <Form.Item label="更新方式" {...formItemLayout}>
                {getFieldDecorator('upgradeWay' , {
                  rules: [{
                    required: true, message: '请选择更新方式!',
                  }]
                })(
                  <Select>
                    <Option value="自动">自动</Option>
                    <Option value="手动">手动</Option>
                  </Select>
                )}
              </Form.Item>
              <Form.Item label="描述" {...formItemLayout}>
                {getFieldDecorator('description', {
                  rules: [{
                    required: true, message: '请输入描述!',
                  }],
                })(
                  <Input />
                )}
              </Form.Item>
              <Form.Item {...tailFormItemLayout}>
                <Button type="primary" htmlType="submit">提交</Button>
              </Form.Item>
            </Form>
          </Col>
          <Col span={12}>
            <Table columns={this.columns} dataSource={data} rowKey={record => record.id} rowSelection={rowSelection} scroll={{ y: 400 }} bordered title={() => '设备列表'}/>
          </Col>
        </Row>
      </Modal>
    )
  }
}
export default Form.create()(VersionEdit);