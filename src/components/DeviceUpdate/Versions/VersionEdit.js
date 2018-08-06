import React from 'react';
import { Modal, Button, Input, Form, Upload, Icon, notification } from 'antd';

class VersionEdit extends React.Component {

  normFile = ({ file, fileList, event }) => {
    console.log('event:', event, 'file:', file, 'fileList:', fileList);
    if (file.status === 'removed') return [];
    return [file];
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const that = this;

        const formData = new FormData();
        for (let key in values) {
          key === 'file' ? formData.append(key, values[key][0]) : formData.append(key, values[key]);
        }
        formData.append('customerId', this.props.customerId);
        let request = new Request('/dev/UploadFile', {
          body: formData,
          method: 'POST',
        });
        fetch(request).then(resp => resp.json()).then(res => {

          if (res.result === 200) {
            notification.success({
              message: '通信成功',
              description: res.message,
            });
            that.props.onChange();
          } else {
            const args = {
              message: '通信失败',
              description: res.message,
              duration: 2,
            };
            notification.error(args);
          }
        }).catch(err => { console.log(err) });
      }
    });
  }

  handleCancel = () => {
    this.props.onChange();
  }

  render() {
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
          offset: 10,
        },
      },
    };
    return (
      <Modal title="版本信息编辑" visible={true} onCancel={this.handleCancel} footer={null}>
        <Form onSubmit={this.handleSubmit}>
          <Form.Item label="版本名称" {...formItemLayout}>
            {getFieldDecorator('versionName', {
              rules: [{
                required: true, message: '请输入版本名称!',whitespace: true
              }]
            })(
              <Input />
            )}
          </Form.Item>
          <Form.Item label="版本号" {...formItemLayout}>
            {getFieldDecorator('versionCode', {
              rules: [{
                required: true, message: '请输入版本号!',whitespace: true
              },{
                pattern:/^\d[\d,\.]*$/,message:"请输入数字或\".\",并以数字开头!"
              }],
            })(
              <Input />
            )}
          </Form.Item>
          <Form.Item label="版本描述" {...formItemLayout}>
            {getFieldDecorator('versionDescription', {
              rules: [{
                required: true, message: '请输入版本描述!', whitespace: true
              }],
            })(
              <Input />
            )}
          </Form.Item>
          <Form.Item label="上传" {...formItemLayout} extra="仅能上传一个文件">
            {getFieldDecorator('file', {
              rules: [{
                required: true, message: '选择要上传的文件!',
              }],
              valuePropName: 'fileList',
              getValueFromEvent: this.normFile,
            })(
              <Upload
                action="/UploadFile"
                name="file"
                beforeUpload={(file) => {
                  this.props.form.setFieldsValue({ file: [file] });
                  return false;
                }}
              >
                <Button>
                  <Icon type="upload" /> 上传软件包
                </Button>
              </Upload>
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
export default Form.create()(VersionEdit);