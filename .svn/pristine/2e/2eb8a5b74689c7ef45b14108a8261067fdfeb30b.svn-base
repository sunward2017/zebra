import React, { PureComponent } from 'react';
import { Modal, notification, Button, Spin } from 'antd';
import FeedCard from './feedBackCard';
import { FeedForm, RevertForm } from './feedForm';
import servers from '@/server'

const noticeErrInfo = (res) => {
    const args = {
        message: '通信失败',
        description: res.message,
        duration: 2,
    };
    notification.error(args);
}

class card extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            formType: '',
            title: '',
            visible: false,
            confirmLoading: false,
            revers: [],
            loading: true,
            fields: {},
            isMounted: true,
        }
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.zebracrossingId !== this.props.zebracrossingId) {
            const { zebracrossingId } = nextProps
            this.getQualityFeedback({ zebracrossingId })
        }
    }
    componentDidMount() {

        this.getQualityFeedback()
    }
    componentWillUnmount() {
        this.setState({ isMounted: false })
    }
    getQualityFeedback = (data) => {
        let id = data || { zebracrossingId: this.props.zebracrossingId }
        this.setState({ loading: true })
        servers.getQualityFeedbackInfo(id).then(res => {
            if (this.state.isMounted) {
                this.setState({ loading: false })
                if (res.result == 200) {
                    res.data ? this.setState({ revers: res.data }) : this.setState({ revers: {} })
                } else {
                    noticeErrInfo(res)
                }
            }
        })
    }
    openEditFeed = (r) => {
        const zebracrossingId = this.props.zebracrossingId;
        this.setState({ title: r, visible: true, fields: { zebracrossingId } })
    }
    handleCancel = () => {
        this.setState({
            visible: false,
        });
    }
    refresh = () => {
        this.handleCancel();
        this.getQualityFeedback();
    }
    editForm = (r) => {
        let title = r.feedbackPerson ? '反馈' : '回复';
        this.setState({ title, visible: true, fields: r })
    }

    delQualityFeedback(id) {
        servers.deleteQualityFeedbackInfo({ id }).then(res => {
            if (res.result === 200) {
                this.getQualityFeedback()
            } else {
                noticeErrInfo(res)
            }
        })
    }

    render() {
        const { title, confirmLoading, revers, loading, fields } = this.state;
        const el = loading ? <Spin spinning={this.state.loading} /> :
            <div>
                {revers.length > 0 ? <FeedCard data={revers} action={(r) => { this.openEditFeed(r) }} delQualityFeedback={(id) => { this.delQualityFeedback(id) }} edit={this.editForm} /> : <Button type="primary" onClick={() => { this.openEditFeed('反馈') }}>反馈</Button>}
                <Modal
                    title={this.state.title}
                    visible={this.state.visible}
                    confirmLoading={confirmLoading}
                    onCancel={this.handleCancel}
                    footer={null}
                >
                    {
                        title === '回复' ? <RevertForm {...fields} refresh={this.refresh} /> : <FeedForm {...fields} refresh={this.refresh} />
                    }
                </Modal>
            </div>
        return el;

    }
}

export default card;