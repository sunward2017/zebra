import React, { PureComponent } from 'react'
import { connect } from 'react-redux';
import { Form, Input, Button, notification, Popconfirm, Spin } from 'antd'
import servers from '@/server';
import UploadImg from '@/common/UploadImg'
import Ueditor from '@/common/Ueditor';

const FormItem = Form.Item;

const noticeErrInfo = (res) => {
    const args = {
        message: '失败',
        description: res.message,
        duration: 2,
    };
    notification.error(args);
};
const noticeSuccessInfo = (res) => {
    const args = {
        message: '成功',
        description: res.message,
        duration: 2,
    };
    notification.success(args);
};

class RegistrationForm extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            subLoading: false,
            isLoading: true,
            field: {}
        }
    }

    componentWillMount() {
        const { zebracrossingId } = this.props;
        this.getCompletedInfo({ zebracrossingId })
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.zebracrossingId !== nextProps.zebracrossingId) {
            this.getCompletedInfo({ zebracrossingId: nextProps.zebracrossingId });
        }
    }

    getCompletedInfo = (data) => {
        this.setState({ isLoading: true });
        servers.getCompletedInfo(data).then(res => {
            if (res.result === 200) {
                res.data ? this.setState({ field: res.data }) : this.setState({ field: {} });
            } else {
                noticeErrInfo(res);
            }
            this.setState({ isLoading: false })
        })
    };

    handleOk = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                const { zebracrossingId } = this.props;
                const { id } = this.state.field;
                if (id) values.id = id;
                values.Action = id ? 1 : 0;
                values.zebracrossingId = zebracrossingId;
                this.setState({ subLoading: true });
                servers.modifyCompletedInfo(values).then(res => {
                    this.setState({ subLoading: false });
                    if (res.result == 200) {
                        const { zebracrossingId } = this.props;
                        this.getCompletedInfo({ zebracrossingId });
                        noticeSuccessInfo(res)
                    } else {
                        noticeErrInfo(res)
                    }

                })
            }
        });
    };

    handleDelete = () => {
        const { id } = this.state.field;
        this.setState({ delLoading: true });
        const { zebracrossingId } = this.props;
        servers.deleteCompletedInfo({ id }).then(res => {
            if (res.result == 200) {
                this.setState({ isEdit: false, delLoading: false });
                this.getCompletedInfo({ zebracrossingId })
                noticeSuccessInfo(res)
            } else {
                noticeErrInfo(res)
            }
        })
    };

    render() {
        const { acceptor, imgUuid, content, id , } = this.state.field;
        const account = this.state.field.account||this.props.account;
        const { isLoading } = this.state;
        const { getFieldDecorator } = this.props.form;
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
            <div>
                <h1>竣工单</h1>
                {isLoading ? <Spin /> :
                    <Form>
                        <FormItem
                            {...formItemLayout}
                            label="记录人"
                        >
                            {getFieldDecorator('operate', {
                                rules: [{
                                    required: true, message: '请输入操作员',
                                }],
                                initialValue: account
                            })(
                                <Input style={{ width: '100%' }} disabled />
                            )}
                        </FormItem>


                        <FormItem
                            {...formItemLayout}
                            label="竣工内容"
                        >
                            {getFieldDecorator('content', {
                                rules: [{ required: true, message: '请输入竣工内容', whitespace: true }],
                                initialValue: content,
                            })(
                                <Ueditor />
                            )}
                        </FormItem>
                        <FormItem
                            {...tailFormItemLayout}
                        >
                            <UploadImg imgUuid={imgUuid} title="竣工单图片上传" />
                        </FormItem>
                        <FormItem {...tailFormItemLayout}>
                            <Button type='primary' onClick={(e) => { this.handleOk(e) }} style={{ marginRight: 8 }} loading={this.state.subLoading}> 提交</Button>
                            <Popconfirm title="确定删除" onConfirm={() => this.handleDelete()}>
                                <Button type="primary" loading={this.state.delLoading} disabled={!id}>删除</Button>
                            </Popconfirm>
                        </FormItem>
                    </Form>}
            </div>
        );
    }
}

const mapState = (state) => {
    //console.log(state)
    return {
        account: state.auth.user.account,
    }
}

const CompletionForm = connect(mapState)(Form.create({
    mapPropsToFields(props) {
        let cusProps = {};
        for (var k in props.data) {
            cusProps[k] = Form.createFormField({
                ...props[k],
                value: props[k].value,
            })
        }
        return cusProps;
    }
})(RegistrationForm));


export default CompletionForm;

