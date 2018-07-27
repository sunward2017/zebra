import React from 'react'
import { Form, Input, DatePicker, Button, message } from 'antd';
import { connect } from 'react-redux'
import moment from 'moment'
import servers from '@/server'
import UploadImg from '@/common/UploadImg'

const { TextArea } = Input;

const FormItem = Form.Item;

const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 },
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
class FeedBackForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    callback = () => {
        this.props.refresh();
    }
    handleSubmit = () => {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const { refresh, id } = this.props
                values = {
                    ...values,
                    'createTime': values.createTime.format('YYYY-MM-DD HH:ss:mm'),
                    'zebracrossingId': this.props.zebracrossingId
                }
                values.Action = id ? 1 : 0;
                if(id)values.id = id;
                servers.modifyQualityFeedbackInfo(values).then(res => {
                    if (res.result === 200) {
                        refresh();
                    } else {
                        message.error(res.message);
                    }
                })
            }
        })

    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const { feedbackPerson, createTime, content, imgUuid } = this.props;
        return (
            <Form>
                <FormItem
                    {...formItemLayout}

                    label='反馈人'
                >
                    {getFieldDecorator('feedbackPerson', {
                        rules: [{ required: true, message: '请输入反馈人' }],
                        initialValue: feedbackPerson
                    })(
                        <Input placeholder="反馈人名" />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="反馈日期"
                >
                    {getFieldDecorator('createTime', {
                        rules: [{
                            required: true, message: '请输入反馈日期',
                        }],
                        initialValue: createTime ? moment(createTime) : moment()
                    })(
                        <DatePicker
                            style={{ width: '100%' }}
                            showTime
                            format="YYYY-MM-DD HH:mm:ss"
                        />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}

                    label="反馈信息"
                >
                    {getFieldDecorator('content', {
                        rules: [{ required: true, message: '请输入反馈内容' }],
                        initialValue: content
                    })(
                        <TextArea rows={5} />
                    )}
                </FormItem>
                <FormItem
                    {...tailFormItemLayout}
                >
                    <UploadImg imgUuid={imgUuid} title="反馈图片上传" getImg={this.callback} />
                </FormItem>
                <FormItem {...tailFormItemLayout}>
                    <Button type="primary" onClick={this.handleSubmit}>保存</Button>&emsp;
                </FormItem>
            </Form>
        );
    }
}


class RevertBackForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    callback = () => {
        this.props.refresh();
    }

    handleSubmit = () => {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const { refresh, id } = this.props
                values = {
                    ...values,
                    'revertDate': values.revertDate.format('YYYY-MM-DD HH:ss:mm'),
                    'zebracrossingId': this.props.zebracrossingId
                }
                values.Action = id ? 1 : 0;
                if(id)values.id = id;
                servers.modifyQualityFeedbackInfo(values).then(res => {
                    if (res.result === 200) {
                        refresh();
                    } else {
                        message.error(res.message);
                    }
                })
            }
        })

    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const { operate, revertPerson, revertDate, revertContent, imgUuid } = this.props;
        return (
            <Form>
                <FormItem
                    {...formItemLayout}
                    label='操作者'
                >
                    {getFieldDecorator('operate', {
                        rules: [{ required: true, message: '请输入操作者' }],
                        initialValue: operate
                    })(
                        <Input placeholder="操作者名" disabled />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}

                    label="回复人"
                >
                    {getFieldDecorator('revertPerson', {
                        rules: [{ required: true, message: '请输入回复人' }],
                        initialValue: revertPerson,
                    })(
                        <Input placeholder="回复人名" />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="回复日期"
                >
                    {getFieldDecorator('revertDate', {
                        rules: [{
                            required: true, message: '请输入回复日期',
                        }],
                        initialValue: revertDate ? moment(revertDate) : moment()
                    })(
                        <DatePicker
                            style={{ width: '100%' }}
                            showTime
                            format="YYYY-MM-DD HH:mm:ss"
                        />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}

                    label="回复内容"
                >
                    {getFieldDecorator('revertContent', {
                        rules: [{ required: true, message: '请输入反馈内容' }],
                        initialValue: revertContent
                    })(
                        <TextArea rows={5} />
                    )}
                </FormItem>
                <FormItem
                    {...tailFormItemLayout}
                >
                    <UploadImg imgUuid={imgUuid} title="回复图片上传" getImg={this.callback} />
                </FormItem>
                <FormItem {...tailFormItemLayout}>
                    <Button type="primary" onClick={this.handleSubmit}>保存</Button>&emsp;
                </FormItem>

            </Form>
        );
    }
}

const mapState = (state) => {
    return {
        operate: state.auth.user.account,
    }
}
const FeedForm = Form.create()(FeedBackForm);

const RevertForm = connect(mapState)(Form.create()(RevertBackForm));

export { FeedForm, RevertForm }