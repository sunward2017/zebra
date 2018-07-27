import React, { PureComponent } from 'react'
import { Form, Input, DatePicker, Button, InputNumber, Select, notification } from 'antd'
import { isPhone } from "@/utils"
import servers from '@/server'

const FormItem = Form.Item;
const Option = Select.Option
const { TextArea } = Input;

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
            devs: [],
        }
    }
    componentDidMount() {
        const zebracrossingId = this.props.zebracrossingId.value;
        this.getDeviceList({ zebracrossingId })
    }

    getDeviceList = (param) => {
        servers.getBanMaLineDevList(param).then(res => {
            if (res.result === 200) {
                this.setState({ devs: res.data })
            } else {
                noticeErrInfo(res)
            }
        })
    }
    handleSubmit = (e) => {
        e.preventDefault();
        const { zebracrossingId, id } = this.props;
        this.props.form.validateFieldsAndScroll((err, fieldValues) => {
            if (!err) {
                const dev = this.state.devs.find(i => i.devId === fieldValues.devId);
                const values = {
                    ...fieldValues,
                    'sendDay': fieldValues.sendDay.format('YYYY-MM-DD HH:mm:ss'),
                    'rebackDay': fieldValues.rebackDay.format('YYYY-MM-DD HH:mm:ss'),
                    'zebracrossingId': zebracrossingId.value,
                    'devSn': dev.devSn,
                }
                if (!id) {
                    servers.insertDeviceRepairInfo(values).then(res => {
                        if (res.result == 200) {
                            this.props.refresh();
                        } else {
                            noticeErrInfo(res)
                        }
                    })
                } else {
                    values.id = id.value;
                    servers.modifyDevRepairInfo(values).then(res => {
                        if (res.result == 200) {
                            this.props.refresh();
                        } else {
                            noticeErrInfo(res)
                        }
                    })
                }

            }
        });
    }

    validatePhone = (rule, value, callback) => {
        if (value && !isPhone(value)) {
            callback('手机号码不正确')
        } else {
            callback();
        }
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const { devs } = this.state;
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
                    label="设备名称"
                >
                    {getFieldDecorator('devId', {
                        rules: [{
                            required: true, message: '请其选择设备',
                        },],

                    })(
                        <Select
                            showSearch
                            placeholder="Select a person"
                            optionFilterProp="children"
                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        >{
                                devs ? devs.map((i,n )=> {
                                    return <Option value={i.devId} key={n}>{i.devSn}</Option>
                                }) : null
                            }
                        </Select>,
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="报修人"
                >
                    {getFieldDecorator('sendPerson', {
                        rules: [{
                            required: true, message: '请输入报修人',
                        }],

                    })(
                        <Input placeholder="张XX" />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="报修人手机"
                >
                    {getFieldDecorator('sendPhone', {
                        rules: [{ required: true, message: '请输入报修人联系方式' }, { validator: this.validatePhone }],
                    })(
                        <Input placeholder="158XXXXXXXXX" />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="报修日期"
                >
                    {getFieldDecorator('sendDay', {
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
                    label="故障简要描述"
                >
                    {getFieldDecorator('problemDescribe', {
                        rules: [{ required: true, message: '请输入故障信息', whitespace: true }],
                    })(
                        <TextArea rows={3} />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="接收人"
                >
                    {getFieldDecorator('recvName', {
                        rules: [{ required: true, message: '请输入接收人', whitespace: true }],
                    })(
                        <Input placeholder="XXXX" />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="预估修复天数"
                >
                    {getFieldDecorator('estimateDays', {
                        rules: [{ required: true, message: '请输入预估天数', }],
                        initialValue: 3
                    })(
                        <InputNumber min={1} max={10} />
                    )}
                    <span>&emsp;天</span>
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="修复完成日期"
                >
                    {getFieldDecorator('rebackDay', {
                        rules: [{ required: true, message: '请输入修复日期', }],
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
                    label="处理人"
                >
                    {getFieldDecorator('handlePerson', {
                        rules: [{ required: true, message: '请输入处理人', whitespace: true }],
                    })(
                        <Input placeholder="XXXXX" />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="公司名称"
                >
                    {getFieldDecorator('companyName', {
                        rules: [{ required: true, message: '请输入公司名称', whitespace: true }],
                    })(
                        <Input placeholder="XXXXX有限责任公司" />
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

const RepairForm = Form.create({
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


export default RepairForm


