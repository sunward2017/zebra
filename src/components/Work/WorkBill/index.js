import React from 'react';
import {Table ,Tabs,Icon, Button, Select, notification, Divider, Form, Input,Modal, TreeSelect  } from 'antd';
import servers from '@/server'
import { connect } from 'react-redux';  //数据连接
import { formatData, restore } from '@/utils'
import {getToken} from '@/utils/auth'
import WorkBillForm from './form'


const { TextArea } = Input;
const FormItem = Form.Item;
const Option = Select.Option;
const TabPane = Tabs.TabPane;
const confirm = Modal.confirm;


export default class workBill extends React.Component {
    constructor(props) {
        super(props);
        this.columns = [
            {
            title: '斑马线ID',
            dataIndex: 'zebracrossingId',
            key: 'zebracrossingId',
        },
            {
            title: '操作',
            dataIndex: 'operate',
            key: 'operate',
        },{
            title: '图片',
            dataIndex: 'imgUuid',
            key: 'imgUuid',
        },{
            title: '内容',
            dataIndex: 'content',
            key: 'content',
        },{
            title: 'Action',
            key: 'action',
            render: (text, record) => (<span>
        <a href="javascript:;" onClick={() => { this.modify(record) }} style={{marginRight:20}}>编辑</a>
        <a href="javascript:;" onClick={() => { this.handleDelete(record) }}>删除</a>
      </span>
            )
        }
        ];
        this.state = {
            customerId: '',
            token:[],
            workBillData:[],
            session:'',
            account:'',
            activeKey: '1',
            Action:0,
            zebraId:0,
            fields:{},
        };
    }
    componentWillMount(){
        this.getInitial();
        const { zebracrossingId } = this.props;
        this.getWorkBillInfo({ zebracrossingId });
    };

    getInitial(){
        this.token = getToken();
        // console.log("getToken");
        // console.log(this.token.session);
        this.session = this.token.session;
        this.account = this.token.account;
        this.customerId = this.token.customerId;
        // console.log(this.token);
    };

    componentWillReceiveProps(nextProps) {
        if (this.props.zebracrossingId !== nextProps.zebracrossingId) {
            this.getWorkBillInfo({ zebracrossingId: nextProps.zebracrossingId });
        }
    }


    getWorkBillInfo=(zebracrossingId)=>{
        servers.getDayWorkRecoder(zebracrossingId).then(res => {
            console.log("getWorkBillInfo");
            console.log(res.result);
            console.log(res);
            if (res.result == 200) {
                res.data ? this.setState({ workBillData: res.data }) : this.setState({ workBillData: [] });
            } else {
                const args = {
                    message: '通信失败',
                    description: res.message,
                    duration: 2,
                };
                notification.error(args);
            }
        }).catch(
            err => { console.log(err) }
        )
    };

    callback = (activeKey) => {
        (!this.state.fields.Action) && (this.modify());
        this.setState({ activeKey });
    };

    modify=(record)=>{
        let data = formatData({ ...record })
        this.setState({ activeKey: '2', fields: {...data,Action: { value: 1 }} })
    };
    //新增
    handleModifyWorkBill = (values) =>{
        let options = restore(this.state.fields);
        // let options = restore(this.state.fields);
        // let _this =this;
        const { zebracrossingId } = this.props;
        const { id } = this.state.field;
        if (id) values.id = id;
        values.Action = id ? 1 : 0;
        values.zebracrossingId = zebracrossingId;

        servers.modifyDayWorkRecoder(values).then(res => {
            let { result, message } = res;
            if (result == 200) {
                const args = {
                    message: '提交成功',
                    description: message,
                    duration: 2,
                };
                notification.success(args);
                this.setState({ activeKey: '1' });
                this.getWorkBillInfo(zebracrossingId);
            } else {
                const args = {
                    message: '提交失败',
                    description: message,
                    duration: 2,
                };
                notification.error(args);
            }

        })
    };

    handleFormChange = (changedFields) => {
        this.setState(({ fields }) => ({
            fields: { ...fields, ...changedFields },
        }));
    };

    handleDelete = (record) => {
        // console.log(record);
        let _this =this;
        const { zebracrossingId } = this.props;
        confirm({
            title: "你确认删除施工单",
            // content: record.content,
            okText: '确认',
            okType: 'danger',
            cancelText: '取消',
            onOk() {
                let { id } = record;
                console.log(id);
                servers.delDayWorkRecoder({id}).then(res=>{
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
                    _this.getWorkBillInfo(zebracrossingId);
                }).catch(e=>{console.log(e)})
            },
            onCancel() {
                console.log('Cancel');
            },
        });

    };

    render(){
        const fields = this.state.fields;
        const operation = <Button onClick={this.modify}>新增</Button>;

        // const { getFieldDecorator } = this.props.form;
        // const { autoCompleteResult } = this.state;

        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 8 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 15 },
            },
        };
        return (
            <div style={{marginTop:10 }}>
               <h1>施工单</h1>
                <div style={{marginTop:10,height:'100%' }}>

                        <Tabs tabBarExtraContent={operation} activeKey={this.state.activeKey} onChange={this.callback}>
                            <TabPane tab={<span><Icon type="usergroup-add" />施工单列表</span>} key="1">
                                <Table dataSource={this.state.workBillData} columns={this.columns} />
                            </TabPane>
                            <TabPane tab={<span><Icon type="user-add" />施工单输入</span>} key="2">
                                {/*使用子组件*/}
                                <div style={{height:'100%'}}>
                                <WorkBillForm modifyDayWorkRecoder={this.handleModifyWorkBill} {...fields} onChange={this.handleFormChange} />
                                </div>
                            </TabPane>
                        </Tabs>
                    </div>
            </div>
        );
    };
}

// const mapState = (state) => {
//     const { customerId } = state.auth.user;
//     return { customerId }
// };
//
// export const Channel = connect(mapState)(workBill);

