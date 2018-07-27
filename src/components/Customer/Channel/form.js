import React, { PureComponent } from 'react'
import { Form, Input, Tooltip, Icon, Button, AutoComplete } from 'antd'
import { isPhone } from "@/utils"

const FormItem = Form.Item;
const AutoCompleteOption = AutoComplete.Option;



class RegistrationForm extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            confirmDirty: false,
            autoCompleteResult: [],
        }
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                let { modifyCustomerInfo } = this.props;
                modifyCustomerInfo()
            }
        });
    }
    handleWebsiteChange = (value) => {
        let autoCompleteResult;
        if (!value) {
            autoCompleteResult = [];
        } else {
            autoCompleteResult = ['.com', '.org', '.net', '.cn', '.com.cn'].map(domain => `${value}${domain}`);
        }
        this.setState({ autoCompleteResult });
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
        const { autoCompleteResult } = this.state;


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
        const websiteOptions = autoCompleteResult.map(website => (
            <AutoCompleteOption key={website}>{website}</AutoCompleteOption>
        ));

        return (
            <Form onSubmit={this.handleSubmit}>
                <FormItem
                    {...formItemLayout}
                    label="商户名称"
                >
                    {getFieldDecorator('customerName', {
                        rules: [{
                            required: true, message: '请输入商户名称',
                        },],

                    })(
                        <Input placeholder="xxxxx" />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="商户住址"
                >
                    {getFieldDecorator('customerAddress', {
                        rules: [{
                            required: true, message: '请输入商户住址',
                        }],

                    })(
                        <Input placeholder="xx市/xx区/xx街" />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label={(
                        <span>
                            联系人&nbsp;
                            <Tooltip title="联系人变更请及时更新">
                                <Icon type="question-circle-o" />
                            </Tooltip>
                        </span>
                    )}
                >
                    {getFieldDecorator('contacts', {
                        rules: [{ required: true, message: '请输入联系人', whitespace: true }],

                    })(
                        <Input placeholder="张XX" />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="相片"
                >
                    {getFieldDecorator('faceUrl', {
                        rules: [{ type: "url", required: true, message: '请输入正确的相片地址', whitespace: true }],
                    })(
                        <Input placeholder="http://xx/xx/xx/xx.jpg" />
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
                        rules: [{ required: true, message: '请输入电话号码' , whitespace: true}],
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
                    label="传真"
                >
                    {getFieldDecorator('fax', {
                        rules: [{ required: true, message: '请输入传真' }],
                    })(
                        <Input placeholder="0517-XXXXXXXX" />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="网址"
                >
                    {getFieldDecorator('website', {
                        rules: [{ required: true, message: '请输入网址' }],
                    })(
                        <AutoComplete
                            dataSource={websiteOptions}
                            onChange={this.handleWebsiteChange}
                            placeholder="xxxx.com"
                        >
                            <Input />
                        </AutoComplete>
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
                    <Button type="primary" htmlType="submit">确认提交</Button>
                </FormItem>
            </Form>
        );
    }
}

const channelForm = Form.create({
    onFieldsChange(props, changedFields) {
        props.onChange(changedFields);
    },
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


export default channelForm


