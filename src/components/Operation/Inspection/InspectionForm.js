import React, { PureComponent } from 'react'
import { connect } from 'react-redux';
import { Form, Input, Button, notification, Popconfirm, Spin, Col, Row } from 'antd'
import servers from '@/server';
import UploadImg from '@/common/UploadImg'
import Ueditor from '@/common/Ueditor';
import ImgList from '@/common/ImgList'

const FormItem = Form.Item;

const noticeErrInfo = (res) => {
    const args = {
        message: '失败',
        description: res.message,
        duration: 2,
    };
    notification.error(args);
}
const noticeSuccessInfo = (res) => {
    const args = {
        message: '成功',
        description: res.message,
        duration: 2,
    };
    notification.success(args);
}

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
        this.getInspectionInfo()
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.zebracrossingId !== nextProps.zebracrossingId) {
            this.getInspectionInfo({ zebracrossingId: nextProps.zebracrossingId });
        }
    }

    getInspectionInfo = (data) => {
        var id = data || { zebracrossingId: this.props.zebracrossingId }
        this.setState({ isLoading: true })
        servers.getInspectionInfo(id).then(res => {
            if (res.result === 200) {
                res.data ? this.setState({ field: res.data }) : this.setState({ field: {} });
            } else {
                noticeErrInfo(res);
            }
            this.setState({ isLoading: false })
        })
    }

    handleOk = (e) => {
        e.preventDefault();
        this.setState({subLoading:true})
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                const { zebracrossingId } = this.props;
                const { id } = this.state.field;
                if (id) values.id = id;
                values.Action = id ? 1 : 0;
                values.zebracrossingId = zebracrossingId;
                this.setState({ subLoading: true })
                servers.modifyInspectionInfo(values).then(res => {
                    this.setState({ subLoading: false })
                    if (res.result === 200) {
                        this.getInspectionInfo()
                        noticeSuccessInfo(res)
                    } else {
                        noticeErrInfo(res)
                    }

                })
            }
        });
    }
    handleDelete = () => {
        const { id } = this.state.field;
        this.setState({ delLoading: true })
        
        servers.deleteInspectionInfo({ id }).then(res => {
            if (res.result === 200) {
                this.setState({ isEdit: false, delLoading: false });
                this.getInspectionInfo()
                noticeSuccessInfo(res)
            } else {
                noticeErrInfo(res)
            }
        })
    }

    render() {
        const { acceptor, imgUuid, content, id } = this.state.field;
        const account = this.state.field.account || this.props.account;
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
                    offset: 4,
                },
            },
        };

        return (
            <div>
                {isLoading ?
                    <Spin /> :
                    <Row>
                        <Col span={20}>
                            <Form>
                                <FormItem
                                    {...formItemLayout}
                                    label="记录人"
                                >
                                    {getFieldDecorator('operate', {
                                        rules: [{
                                            required: true, message: '请输入记录人',
                                        }],
                                        initialValue: account
                                    })(
                                        <Input style={{ width: '100%' }} disabled />
                                    )}
                                </FormItem>

                                <FormItem
                                    {...formItemLayout}
                                    label="验收人"
                                >
                                    {getFieldDecorator('acceptor', {
                                        rules: [{ required: true, message: '请输入验收人', whitespace: true }],
                                        initialValue: acceptor,
                                    })(
                                        <Input style={{ width: '100%' }} />
                                    )}
                                </FormItem>
                                <FormItem
                                    {...formItemLayout}
                                    label="验收内容"
                                >
                                    {getFieldDecorator('content', {
                                        rules: [{ required: true, message: '请输入验收内容', whitespace: true }],
                                        initialValue: content,
                                    })(
                                        <Ueditor />
                                    )}
                                </FormItem>
                                <FormItem
                                    {...tailFormItemLayout}
                                >
                                    <UploadImg imgUuid={imgUuid} title="验收单图片上传" getImg={this.getInspectionInfo} />
                                </FormItem>
                                <FormItem {...tailFormItemLayout}>
                                    <Button type='primary' onClick={(e) => { this.handleOk(e) }} style={{ marginRight: 8 }} loading={this.state.subLoading}> 提交</Button>
                                    <Popconfirm title="确定删除" onConfirm={() => this.handleDelete()}>
                                        <Button type="primary" loading={this.state.delLoading} disabled={!id}>删除</Button>
                                    </Popconfirm>
                                </FormItem>
                            </Form>
                        </Col>
                        <Col span={4}>
                            <ImgList fuuid={imgUuid} title='相关图片' />
                        </Col>

                    </Row>
                }
            </div>
        );
    }
}

const mapState = (state) => {
    return {
        account: state.auth.user.account,
    }
}

const InspectionForm = connect(mapState)(Form.create()(RegistrationForm));


export default InspectionForm;

