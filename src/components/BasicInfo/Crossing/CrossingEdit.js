import React from 'react';
import { Modal, Button, Input, Form } from 'antd';

class CrossingEdit extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      record:this.props.record
    }
  }
  
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.onChange(Object.assign({},this.props.record,values));
      }
    });
  }
  
  handleCancel = () => {
    this.props.onChange();
  }
  
  render () {
    const { roadName, address, longitude, latitude, zebracrossingName } = this.state.record;
    const { getFieldDecorator } = this.props.form;
    const { zebra } = this.props;
    const name = zebra ? 'zebracrossingName' : 'roadName';
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
    return (
    <Modal title={zebra ? "斑马线信息" : "路口信息"} visible={true} onCancel={this.handleCancel} footer={null}>
      <Form onSubmit={this.handleSubmit}>
        <Form.Item label="名称" {...formItemLayout}>
          {getFieldDecorator(name , {
            rules: [{
              required: true, message: '请输入名称!',
            }],
            initialValue:roadName || zebracrossingName
          })(
            <Input />
          )}
        </Form.Item>
        <Form.Item label="地址" {...formItemLayout}>
          {getFieldDecorator('address', {
            rules: [{
              required: true, message: '请输入地址!',
            }],
            initialValue:address
          })(
            <Input />
          )}
        </Form.Item>
        <Form.Item label="经度" {...formItemLayout}>
          {getFieldDecorator('longitude', {
            initialValue:longitude
          })(
            <Input />
          )}
        </Form.Item>
        <Form.Item label="维度" {...formItemLayout}>
          {getFieldDecorator('latitude', {
            initialValue:latitude
          })(
            <Input />
          )}
        </Form.Item>
        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit">提交</Button>
        </Form.Item>
      </Form>
    </Modal>
    )
  }
}
export default Form.create()(CrossingEdit);