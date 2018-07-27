import React, { PureComponent } from 'react';
import { Form, Input, Icon, Button, Radio, DatePicker } from 'antd';
import moment from 'moment'
import { isPhone } from '@/utils'


const FormItem = Form.Item;
const RadioGroup = Radio.Group;

class RegistrationForm extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            confirmDirty: false,
        }
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                let { modify, Action, id } = this.props;
                if (id) values.id = id.value;
                values = {
                    ...values,
                    'brithday': values.brithday.format('YYYY-MM-DD HH:mm:ss'),
                    'entryTime': values.entryTime.format('YYYY-MM-DD HH:mm:ss'),
                    'quitTime': values.quitTime.format('YYYY-MM-DD HH:mm:ss'),
                    'Action': Action.value,
                }

                modify(values)
            }

        });
    }
    validatePhoneNumber = (rule, value, callback) => {
        if (value && !isPhone(value)) {
            callback('手机号码不正确')
        } else {
            callback();
        }
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 8 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 8 },
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
                    offset: 8,
                },
            },
        };


        return (
            <Form onSubmit={this.handleSubmit}>
                <FormItem
                    {...formItemLayout}
                    label="登录名"
                >
                    {getFieldDecorator('account', {
                        rules: [{
                            required: true, message: '请输入登录名',
                        }, {
                            validator: this.validateToNextPassword,
                        }],

                    })(
                        <Input placeholder="李xxxx" />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="密码"
                >
                    {getFieldDecorator('password', {
                        rules: [{
                            required: true, message: '请输入用户密码',
                        }],

                    })(
                        <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="XXXXX" />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="姓名"
                >
                    {getFieldDecorator('name', {
                        rules: [{ required: true, message: '请输入联系人', whitespace: true }],

                    })(
                        <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="张XX" />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="性别"
                >
                    {getFieldDecorator('gender', {
                        rules: [{ required: true, message: '请输入联系人', whitespace: true }],

                    })(
                        <RadioGroup>
                            <Radio value="1">男</Radio>
                            <Radio value="0">女</Radio>
                        </RadioGroup>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="相片"
                >
                    {getFieldDecorator('faceUrl', {
                        rules: [{ type: "url", required: true, message: '请输入图片url' }],
                    })(
                        <Input placeholder="xx/xx/xx/xx.jpg" />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="手机号码"
                >
                    {getFieldDecorator('telnumber', {
                        rules: [{
                            required: true, message: '请输入手机号'
                        }, {
                            validator: this.validatePhoneNumber,
                        }],
                    })(
                        <Input placeholder="158XXXXXXXX" />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="生日"
                >
                    {getFieldDecorator('brithday', {
                        rules: [{ required: true, message: '请输入生日' }],
                    })(
                        <DatePicker
                            showTime
                            format="YYYY-MM-DD HH:mm:ss"
                            className="dateTime"
                        />
                        // <Input/>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="工号"
                >
                    {getFieldDecorator('jobNumber', {
                        rules: [{ required: true, message: '请输入工号' }],
                    })(
                        <Input placeholder="1XXXXXX" />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="入职时间"
                >
                    {getFieldDecorator('entryTime', {
                        rules: [{
                            required: true, message: '请输入入职时间',
                        }],
                    })(
                        <DatePicker
                            showTime
                            format="YYYY-MM-DD HH:mm:ss"
                            className="dateTime"
                        />
                    )}
                </FormItem>

                <FormItem
                    {...formItemLayout}
                    label="离职时间"
                >
                    {getFieldDecorator('quitTime', {
                        rules: [{ required: true, message: '请输入离职时间' }],
                    })(
                        <DatePicker
                            showTime
                            format="YYYY-MM-DD HH:mm:ss"
                            className="dateTime"
                        />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="状态"
                >
                    {getFieldDecorator('state', {
                        rules: [{ required: true, message: '请输入状态' }],
                    })(
                        <Input placeholder="" />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="级别"
                >
                    {getFieldDecorator('level', {
                        rules: [{ required: true, message: '请输入级别' }],
                    })(
                        <Input placeholder="" />
                    )}
                </FormItem>

                <FormItem {...tailFormItemLayout}>
                    <Button type="primary" htmlType="submit">确认提交</Button>
                </FormItem>
            </Form>
        );
    }
}

const CustomizedForm = Form.create({
    mapPropsToFields(props) {
        let cusProps = {};
        for (var k in props) {
            if (k === 'brithday' || k === "entryTime" || k === "quitTime") {
                let { value } = props[k];
                cusProps[k] = Form.createFormField({
                    value: moment(value),
                })
            } else {
                cusProps[k] = Form.createFormField({
                    ...props[k],
                    value: props[k].value,
                })
            }
        }
        return cusProps;
    }
})(RegistrationForm);


export default CustomizedForm


