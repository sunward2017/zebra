import React, { PureComponent } from 'react'
import { Form, Input, Radio, Button, InputNumber, notification, DatePicker } from 'antd'
import servers from '@/server'
import { connect } from 'react-redux';

const RadioGroup = Radio.Group;
const FormItem = Form.Item;

const noticeErrInfo = (res) => {
    const args = {
        message: '失败',
        description: res.message,
        duration: 2,
    };
    notification.error(args);
}

class RegistrationForm extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            loading: false
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const { zebracrossingId, id, refesh } = this.props;
        this.props.form.validateFieldsAndScroll((err, fieldValues) => {
            if (!err) {
                const values = {
                    ...fieldValues,
                    'createTime': fieldValues.createTime.format('YYYY-MM-DD HH:mm:ss'),
                    'zebracrossingId': zebracrossingId.value
                }
                values.Action = id ? 1 : 0;
                this.setState({ loading: true })
                servers.addBanMaLineDevInfo(values).then(res => {
                    this.setState({ loading: false })
                    if (res.result === 200) {
                        refesh()
                    } else {
                        noticeErrInfo(res)
                    }
                })

            }
        });
    }


    render() {
        const { getFieldDecorator } = this.props.form;
        const { operate } = this.props;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 10 },
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
                    label='操作者'
                >
                    {getFieldDecorator('operateCode', {
                        rules: [{ required: true, message: '请输入操作者' }],
                        initialValue: operate
                    })(
                        <Input placeholder="操作者名" disabled />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="创建日期"
                >
                    {getFieldDecorator('createTime', {
                        rules: [{
                            required: true, message: '请输入保修时间',
                        }],
                    })(
                        <DatePicker
                            showTime
                            format="YYYY-MM-DD HH:mm:ss"
                            style={{ width: '100%' }}
                        />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="设备名称"
                >
                    {getFieldDecorator('devSn', {
                        rules: [{
                            required: true, message: '请输入设备',
                        },],

                    })(
                        <Input />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="数量"
                >
                    {getFieldDecorator('quantity', {
                        rules: [{
                            required: true, message: '请输入数量',
                        }],

                    })(
                        <InputNumber style={{width:'100%'}}/>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="MAC地址"
                >
                    {getFieldDecorator('devMac', {
                        rules: [{ required: true, message: '请输入MAC地址' }],
                    })(
                        <Input placeholder="XXXXXX" />
                    )}
                </FormItem>

                <FormItem
                    {...formItemLayout}
                    label="软件版本"
                >
                    {getFieldDecorator('sysVer', {
                        rules: [{ required: true, message: '请输入软件版本', whitespace: true }],
                    })(
                        <Input placeholder="XXXX" />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="硬件版本"
                >
                    {getFieldDecorator('boardVer', {
                        rules: [{ required: true, message: '请输入硬件版本', }],
                        initialValue: 3
                    })(
                        <Input />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="型号"
                >
                    {getFieldDecorator('model', {
                        rules: [{ required: true, message: '请输入硬件版本', }],
                    })(
                        <Input />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="是否在线"
                >
                    {getFieldDecorator('onlineFlag', {
                        rules: [{ required: true, message: '请选择是否在线', whitespace: true }],
                    })(
                        <RadioGroup>
                            <Radio value="1">是</Radio>
                            <Radio value="0">否</Radio>
                        </RadioGroup>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="状态"
                >
                    {getFieldDecorator('state', {
                        rules: [{ required: true, message: '请输入设备状态', whitespace: true }],
                    })(
                        <RadioGroup>
                            <Radio value="1">启用</Radio>
                            <Radio value="0">禁用</Radio>
                        </RadioGroup>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label='sms卡号'
                >
                    {getFieldDecorator('smsCard', {
                    })(
                        <Input />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="备注"
                >
                    {getFieldDecorator('memo')(
                        <Input />
                    )}
                </FormItem>
                <FormItem {...tailFormItemLayout}>
                    <Button type="primary" htmlType="submit">提 交</Button>
                </FormItem>
            </Form>
        );
    }
}

const zebraDevForm = Form.create({
    mapPropsToFields(props) {
        let cusProps = {};
        for (var k in props) {
            cusProps[k] = Form.createFormField({
                ...props[k],
                value: props[k].value,
            })

        }
        return cusProps;
    }
})(RegistrationForm);

const mapState = (state) => {
    return {
        operate: state.auth.user.account,
    }
}
export default connect(mapState)(zebraDevForm)


