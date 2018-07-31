import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Form, Icon, Input, Button, Checkbox, notification } from 'antd';
import { authResolver } from '@/actions'
import { browserHistory } from 'react-router'
import servers from '@/server'
import {setToken } from '@/utils/auth'


const FormItem = Form.Item;

class NormalLoginForm extends Component {
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      let { dispatch } = this.props;
      if (!err) {
        servers.login(values)
          .then(function (response) {
            let { result, data, message, } = response;
            if (result === 200) {
              console.log('login')
              dispatch(authResolver(data));
              setToken(JSON.stringify(data))
              browserHistory.push("Dashboard");
            } else {
              const args = {
                message: '登录失败',
                description: message,
                duration: 2,
              };
              notification.error(args);
            }
          })
          .catch(function (error) {
            console.log(error);
          });

      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit} className="login-form">
        <FormItem>
          {getFieldDecorator('account', {
            rules: [{ required: true, message: '请输入用户名!' }],
            initialValue:'byf'
          })(
            <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Username" />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: '请输入密码!' }],
            initialValue:'123456' 
          })(
            <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
          )}
        </FormItem>
        <FormItem>
          {/* {getFieldDecorator('remember', {
            valuePropName: 'checked',
            initialValue: true,
          })(
            <Checkbox>Remember me</Checkbox>
          )}
          <a className="login-form-forgot" href="">Forgot password</a>  */}
          <Button type="primary" htmlType="submit" className="login-form-button">
            登录
          </Button>
          {/* Or <a href="">register now!</a> */}
        </FormItem>

      </Form>
    );
  }
}

export default connect()(Form.create()(NormalLoginForm))

