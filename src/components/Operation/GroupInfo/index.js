import React, { PureComponent } from 'react';
import {Table , Modal, Button , Checkbox, Tabs, Icon,Divider,notification,Select,TreeSelect } from 'antd';
// import GroupInfoForm from './form'
import servers from '@/server'
import { formatData, restore } from '@/utils'
import {getToken} from '@/utils/auth'

const Option = Select.Option;
const TabPane = Tabs.TabPane;
const CheckboxGroup = Checkbox.Group;
const TreeNode = TreeSelect.TreeNode;
const confirm = Modal.confirm;

export default class WorkGroup extends PureComponent {
    constructor(props) {
        super(props);

        this.columns = [
            // {
            //     title: '斑马线ID',
            //     dataIndex: 'zebracrossingId',
            //     key: 'zebracrossingId',
            // },
            {
                title: '施工人员ID',
                dataIndex: 'workerId',
                key: 'workerId',
            },{
                title: '施工人员姓名',
                dataIndex: 'workerName',
                key: 'workerName',
            },{
                title: 'Action',
                key: 'action',
                render: (text, record) => (<span>

        {/*<Divider type="vertical" />*/}
        <a href="javascript:;" onClick={() => { this.handleDelete(record) }}>删除</a>
      </span>
                )

            }
        ];

        this.workerColumns = [{
            title: '用户ID',
            dataIndex: 'customerId',
        }, {
            title: '邮箱',
            dataIndex: 'email',
        }, {
            title: '进入时间',
            dataIndex: 'entryTime',
        }, {
            title: '头像',
            dataIndex: 'faceUrl',
        }, {
            title: '备注',
            dataIndex: 'memo',
        }, {
            title: '员工地址',
            dataIndex: 'ownerAddress',
        }, {
            title: '手机号码',
            dataIndex: 'phoneNumber',
        }, {
            title: '邮编',
            dataIndex: 'postcode',
        }, {
            title: 'qq',
            dataIndex: 'qq',
        }, {
            title: '退出时间',
            dataIndex: 'quitTime',
        }, {
            title: '状态',
            dataIndex: 'state',
        }, {
            title: '电话号码',
            dataIndex: 'telNumber1',
        }, {
            title: '员工姓名',
            dataIndex: 'workerName',
        }];
        this.state = {
            visible: false,
            activeKey: '1',
            data: [],
            checked:[],
            set:new Set(),
            roadId:'',
            teamWorkerData:[],
            teamWorkerId:[],
            teamWorkerName:[],
            bol:true,
            zebracrossingId:0,
            // fields: {
            //     workerId: '',
            //     workerName: '',
            //     zebracrossingId: '1',
            //     id:1,
            // },
            fields:{},
        }
    };


    componentWillMount() {
        const { zebracrossingId } = this.props;
        console.log("componentWillMount");
        console.log(zebracrossingId);
        this.state.zebracrossingId = zebracrossingId;
        this.getInitial();
        this.getGroupInfo({ zebracrossingId });
        this.getTeamList();
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.zebracrossingId !== nextProps.zebracrossingId) {
            this.getGroupInfo({ zebracrossingId: nextProps.zebracrossingId });
        }
    }

    getInitial(){
        this.token = getToken();
        // console.log("getToken");
        // console.log(this.token.session);
        this.session = this.token.session;
        this.account = this.token.account;
        this.customerId = this.token.customerId;
        // console.log(this.token);
    };
    //拿到施工人员列表
    getTeamList(){
        servers.getTeamList({customerId:this.customerId}).then(res => {
            if (res.result == 200) {
                console.log("getTeamList");
                console.log(res.data);
                res.data ? this.setState({ teamWorkerData: res.data }) : this.setState({ teamWorkerData: [] });
            } else {
                const args = {
                    message: '获取施工人员失败',
                    description: res.message,
                    duration: 2,
                };
                notification.error(args);
            }
        }).catch(
            err => { console.log(err) }
        );

    };
    //初始化表格
    getGroupInfo=(zebracrossingId)=>{
        servers.getRoadWorkerList( zebracrossingId).then(res => {
            
            if (res.result == 200) {
                res.data ? this.setState({ data: res.data }) : this.setState({ data: [] });
                // console.log(this.state.data);
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

    }

    //函数
    showModal = () => {
        this.setState({
            visible: true,
        });
        console.log("showModal");
        // console.log(this.state.teamWorkerId);
    };

    handleSubmit = (e) => {
        // console.log(1);
        e.preventDefault();
        this.setState({
            visible: false,
        });
        // console.log(this.state.teamWorkerId);
        let zebracrossingId = this.state.zebracrossingId;
        for(let i =0;this.state.teamWorkerId.length>i; i++ ){
            servers.addRoadWorkInfo({zebracrossingId:zebracrossingId,workerId:this.state.teamWorkerId[i],workerName:this.state.teamWorkerName[i]}).then(res => {
                // i++;
                let { result, message } = res;
               
                if (result == 200) {
                    // console.log(2);
                    // console.log(result);
                    // console.log(res);
                    const args = {
                        message: '提交成功',
                        description: message,
                        duration: 2,
                    };
                    notification.success(args);
                    this.getGroupInfo({zebracrossingId});
                } else {
                    const args = {
                        message: '提交失败',
                        description: message,
                        duration: 2,
                    };
                    notification.error(args);
                }

            });
        }

    };

    handleCancel = (e) => {
        // console.log(e);
        this.setState({
            visible: false,
        });
    };

    handleDelete = (record) => {
        console.log(record);
        let _this =this;
        confirm({
            title: "你确认删除施工单",
            // content: record.content,
            okText: '确认',
            okType: 'danger',
            cancelText: '取消',
            onOk() {
                let { id } = record;
                console.log(id);
                servers.deleteRoadWorkerInfo({id}).then(res=>{
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
                    let  zebracrossingId  = _this.state.zebracrossingId ;
                    _this.getGroupInfo({zebracrossingId:zebracrossingId});
                }).catch(e=>{console.log(e)})
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    };


    //render函数
    render(){
        //selectedRows数组
        const rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
                
                    selectedRows.map((item) => {
                        this.state.teamWorkerId.push(item.workerId);
                        this.state.teamWorkerName.push(item.workerName);
                        return null;
                    });
                

                },  // onSelect

                getCheckboxProps: record => ({
                    disabled: record.name === 'Disabled User', // Column configuration not to be checked
                    name: record.name,
                })


        };

        return (
            <div style={{marginTop:10 }}>
                    <div style={{float:'right',marginBottom:5,heigth:100}}>
                    <Button type="primary" onClick={this.showModal}>添加施工人员</Button>
                    <Modal
                        width={1400}
                        title="施工人员添加"
                        visible={this.state.visible}
                        onOk={this.handleSubmit}
                        onCancel={this.handleCancel}
                    >
                        <Table rowSelection={rowSelection} dataSource={this.state.teamWorkerData} columns={this.workerColumns}/>
                    </Modal>
                  </div>

                <div style ={{float:'right',heigth:100, width:'100%' }}>
                    <Table  dataSource={this.state.data} columns={this.columns} />
                </div>
            </div>
        );
    };
}