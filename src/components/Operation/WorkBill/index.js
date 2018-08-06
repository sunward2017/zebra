import React from 'react'
import { Steps, Button, message, notification, Row, Col, Spin } from 'antd';
import servers from '@/server'
import WorkForm from './form'
import {compare} from '@/utils'

const Step = Steps.Step;

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            current: 0,
            workStep: {},
            isLoading: true,
            subLoading: false,
            delLoading: false,
            steps: [],
        };
    }
    componentWillMount() {
        this.getWorkBillInfo();
    };
    componentWillReceiveProps(nextProps) {
        if (this.props.zebracrossingId !== nextProps.zebracrossingId) {
            this.getWorkBillInfo({ zebracrossingId: nextProps.zebracrossingId });
        }
    }
    getWorkBillInfo = (Id) => {
        this.setState({ isLoading: true });
        const id = Id || { zebracrossingId: this.props.zebracrossingId }
        servers.getDayWorkRecoder(id).then(res => {
            if (res.result == 200) {
                res.data&&res.data.sort(compare('workDate'));
                const steps = res.data ? res.data.map((c, i) => ({ title: `步骤${++i}` })) : [{ title: '步骤1' }];
                const { current } = this.state;
                const workStep = res.data ? res.data[current] : { operate: '', content: '', zebracrossingId:id.zebracrossingId };
                this.setState({ workStep, steps })

            } else {
                const args = {
                    message: '通信失败',
                    description: res.message,
                    duration: 2,
                };
                notification.error(args);
            }
            this.setState({ isLoading: false })
        }).catch(
            err => { console.log(err) }
        )
    };
    add = () => {
        const current = this.state.current + 1;
        const l = this.state.steps;
        const steps = l.push({title:`步骤${l.length+1}`})
        const {zebracrossingId } =this.props;
        this.setState({isLoading:true,workStep:{zebracrossingId},current})
        let _this = this;
        setTimeout(()=>{_this.setState({isLoading:false})},500)
    }
    next() {
        const current = this.state.current + 1;
        this.setState({ current });
        this.getWorkBillInfo()
    }

    prev() {
        const current = this.state.current - 1;
        this.setState({ current });
        this.getWorkBillInfo();
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
        const { current, isLoading, workStep ,steps} = this.state;

        return (
            <div>
                <Row gutter={5}>
                    <Col span={18} offset={2}>
                        <Steps current={current}>
                            {steps.map((item, index) => <Step key={index} title={item.title} />)}
                        </Steps>
                    </Col>
                    <Col span={1}></Col>
                    <Col span={3}>
                        <Button type="primary" onClick={this.add} style={{ marginRight:10,marginLeft:30 }} shape="circle" icon="plus"></Button>
                        {
                            current < steps.length - 1
                            && <Button type="primary" onClick={() => this.next()} style={{ marginLeft: 10 }} shape="circle" icon="right-circle"></Button>
                        }
                        {
                            current > 0
                            && (
                                <Button type="primary" style={{ marginLeft: 10 }} shape="circle" onClick={() => this.prev()} icon="left-circle"></Button>
                            )
                        }
                    </Col>
                </Row>
                <div className="steps-content">
                    {isLoading ? <Spin /> : <WorkForm {...workStep} />}
                </div>
            </div>
        );
    }
}