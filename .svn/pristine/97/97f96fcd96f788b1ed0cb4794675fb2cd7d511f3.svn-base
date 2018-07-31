import React from 'react';
import { Modal, Button, Input, Form } from 'antd';

class EditModal extends React.Component {
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
    const { materialName, unit, model, specification, memo } = this.state.record;
    const { getFieldDecorator } = this.props.form;
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
      <Modal title="物料设备编辑" visible={true} onCancel={this.handleCancel} footer={null}>
        <Form onSubmit={this.handleSubmit}>
          <Form.Item label="物料名称" {...formItemLayout}>
            {getFieldDecorator('materialName' , {
              rules: [{
                required: true, message: '请输入物料名称!',
              }],
              initialValue:materialName
            })(
              <Input />
            )}
          </Form.Item>
          <Form.Item label="单位名称" {...formItemLayout}>
            {getFieldDecorator('unit', {
              rules: [{
                required: true, message: '请输入单位名称!',
              }],
              initialValue:unit
            })(
              <Input />
            )}
          </Form.Item>
          <Form.Item label="型号" {...formItemLayout}>
            {getFieldDecorator('model', {
              initialValue:model
            })(
              <Input />
            )}
          </Form.Item>
          <Form.Item label="规格" {...formItemLayout}>
            {getFieldDecorator('specification', {
              initialValue:specification
            })(
              <Input />
            )}
          </Form.Item>
          <Form.Item label="备注" {...formItemLayout}>
            {getFieldDecorator('memo', {
              initialValue:memo
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
export default Form.create()(EditModal);