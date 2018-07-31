import React, { PureComponent } from 'react';
import { Form, Input, Button, DatePicker } from 'antd';
import moment from 'moment'
import { isPhone } from "@/utils"


const FormItem = Form.Item;


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
            if (err) {
                return;
            }
            let { modify, Action, id } = this.props;
            if (id) values.id = id.value;
            values = {
                ...values,
                'entryTime': values.entryTime.format('YYYY-MM-DD HH:mm:ss'),
                'quitTime': values.quitTime.format('YYYY-MM-DD HH:mm:ss'),
                'Action': Action.value,
            }
            modify(values)

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
                    label="团队名称"
                >
                    {getFieldDecorator('workerName', {
                        rules: [{
                            required: true, message: '请输入团队名',
                        }, {
                            validator: this.validateToNextPassword,
                        }],

                    })(
                        <Input placeholder="李xxxx" />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="业主地址"
                >
                    {getFieldDecorator('ownerAddress', {
                        rules: [{
                            required: true, message: '请输入业主地址',
                        }],

                    })(
                        <Input placeholder="XXXXX" />
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
                    {getFieldDecorator('phoneNumber', {
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
                    label="电话号码"
                >
                    {getFieldDecorator('telNumber1', {
                        rules: [{ required: true, message: '请输入电话号码', whitespace: true }],
                    })(
                        <Input placeholder="0571-XXXXXXXX" />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="邮编"
                >
                    {getFieldDecorator('postcode', {
                        rules: [{ required: true, message: '请输入邮编' }, {

                        }],
                    })(
                        <Input placeholder="2XXXXXX" />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="E-mail"
                >
                    {getFieldDecorator('email', {
                        rules: [{
                            type: 'email', message: '请输入正确的邮箱格式',
                        }, {
                            required: true, message: '请输入邮箱',
                        }],
                    })(
                        <Input placeholder="xxx@xxx.com" />
                    )}
                </FormItem>

                <FormItem
                    {...formItemLayout}
                    label="QQ"
                >
                    {getFieldDecorator('qq', {
                        rules: [{ required: true, message: '请输入qq号' }, {

                        }],
                    })(
                        <Input placeholder="12345678" />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="建立时间"
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
                    label="结束时间"
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
                    label="备注"
                >
                    {getFieldDecorator('memo', {
                        rules: [],
                    })(
                        <Input />
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


