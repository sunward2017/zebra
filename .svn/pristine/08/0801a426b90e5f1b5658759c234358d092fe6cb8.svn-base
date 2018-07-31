import React, { PureComponent } from 'react'
import { Form, Input, Button, InputNumber, notification, DatePicker } from 'antd'
import servers from '@/server'


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
            loading: false,
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const { zebracrossingId, id ,refresh} = this.props;
        this.props.form.validateFieldsAndScroll((err, fieldValues) => {
            if (!err) {
                const values = {
                    ...fieldValues,
                    'createTime': fieldValues.createTime.format('YYYY-MM-DD HH:mm:ss'),
                    'zebracrossingId': zebracrossingId.value
                }
                this.setState({loading:true})
                values.Action = id ? 1 : 0;
                servers.addBanMaLineBomInfo(values).then(res => {
                    this.setState({loading:true})
                    if(res.result===200){
                        refresh();
                    }else{
                        noticeErrInfo(res)
                    }
                })

            }
        });
    }


    render() {
        const { getFieldDecorator } = this.props.form;
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
                    label="物料名称"
                >
                    {getFieldDecorator('materialName', {
                        rules: [{
                            required: true, message: '请输入物料名称',
                        }]
                    })(
                        <Input />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="物料编号"
                >
                    {getFieldDecorator('materialCode', {
                        rules: [{
                            required: true, message: '请输入物料编号',
                        },],

                    })(
                        <Input />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="物料类型"
                >
                    {getFieldDecorator('type', {
                        rules: [{
                            required: true, message: '请输入物料类型',
                        },],

                    })(
                        <Input />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="数量"
                >
                    {getFieldDecorator('amount', {
                        rules: [{
                            required: true, message: '请输入数量',
                        }],

                    })(
                        <InputNumber style={{width:'100%'}} />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="创建时间"
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
                <FormItem {...tailFormItemLayout}>
                    <Button type="primary" htmlType="submit">提 交</Button>
                </FormItem>
            </Form>
        );
    }
}

const ZebraMateForm = Form.create({
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
})(RegistrationForm)

export default ZebraMateForm;


