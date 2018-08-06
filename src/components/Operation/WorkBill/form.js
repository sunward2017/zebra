import React, { PureComponent } from 'react';
import { connect } from 'react-redux'
import { Form, Input, Button, notification, Popconfirm, DatePicker, Spin } from 'antd';
import servers from '@/server'
import Ueditor from '../../../common/Ueditor'
import UploadImg from '@/common/UploadImg'
import moment from 'moment';

const FormItem = Form.Item;



class workForm extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            subLoading: false,
            delLoading: false,
            isAdd: false,
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                const { zebracrossingId, id } = this.props;
                values = {
                    ...values,
                    'Action': id ? 1 : 0,
                    'zebracrossingId': zebracrossingId,
                    'workDate': values.workDate.format('YYYY-MM-DD HH:mm:ss')
                }
                if (id) values.id = id;
                this.setState({ subLoading: true })
                servers.modifyDayWorkRecoder(values).then(res => {
                    this.setState({ subLoading: false })
                })
            }
        });
    }
    handleDelete = () => {
        const { id } = this.props;
        servers.delDayWorkRecoder({ id }).then(res => {
            if (res.result == 200) {
                const args = {
                    message: '删除成功',
                    description: res.message,
                    duration: 2,
                };
                notification.success(args);
                // _this.setState({ activeKey: '1' });
            } else {
                const args = {
                    message: '删除失败',
                    description: res.message,
                    duration: 2,
                };
                notification.error(args);
            }

        }).catch(e => { console.log(e) })
    }
    render() {
        const { operate, content, id, imgUuid, account, workDate, isLoading } = this.props;
        const { getFieldDecorator } = this.props.form;
        const { isAdd } = this.state;
        let initOperate = operate || account;

        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 4 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 },
            },
        };
        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 14,
                    offset: 0,
                },
                sm: {
                    span: 16,
                    offset: 0,
                },
            },
        };
        return (
            <Form>
                <FormItem
                    {...formItemLayout}
                    label="记录人"
                >
                    {getFieldDecorator('operate', {
                        rules: [],
                        initialValue: initOperate
                    })(
                        <Input style={{ width: '100%' }} disabled />
                    )}
                </FormItem>

                <FormItem
                    {...formItemLayout}
                    label="施工日期"
                >
                    {getFieldDecorator('workDate', {
                        rules: [{
                            required: true, message: '请输入施工日期',
                        }],
                        initialValue: workDate ? moment(workDate) : moment()
                    })(
                        <DatePicker
                            showTime
                            format='YYYY-MM-DD HH:mm:ss'
                            style={{ width: '100%' }} />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="勘察内容"
                >
                    {getFieldDecorator('content', {
                        rules: [{ required: true, message: '请输入勘察内容', whitespace: true }],
                        initialValue: content,
                    })(
                        <Ueditor />
                    )}
                </FormItem>
                <FormItem
                    {...tailFormItemLayout}
                >
                    <UploadImg imgUuid={imgUuid} title="施工图片上传" />
                </FormItem>
                <FormItem {...tailFormItemLayout}>
                    <Button type='primary' onClick={(e) => { this.handleSubmit(e) }} style={{ marginRight: 8 }} loading={this.state.subLoading}> 提交</Button>
                    <Popconfirm title="确定删除" onConfirm={() => this.handleDelete()}>
                        <Button type="primary" loading={this.state.delLoading} disabled={!id}>删除</Button>
                    </Popconfirm>
                </FormItem>
            </Form>
        );
    }
}

// const WorkBillForm = Form.create({})(RegistrationForm);

const mapState = (state) => {
    return {
        account: state.auth.user.account,
    }
}

const WorkForm = Form.create()(workForm);


export default connect(mapState)(WorkForm)


