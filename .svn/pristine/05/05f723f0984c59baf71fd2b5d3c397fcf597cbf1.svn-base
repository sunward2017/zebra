import React from 'react';
import {Table ,Icon, Button, Select, notification ,Form ,Input, DatePicker,TreeSelect  } from 'antd';
import servers from '@/server'
import { connect } from 'react-redux';
import { formatData, restore } from '@/utils'
import {getToken} from '@/utils/auth'

const Option = Select.Option;
const FormItem = Form.Item;


class ownerInfoForm extends React.Component {
    constructor(props){
        super(props);
        console.log("props");
        console.log(props);
        this.state={
            customerId: '',
            zebraId:0,
            operateId:0,
            token:[],
            session:'',
            account:'',
            activeKey: '1',
            ownerData:[],
            ownerNameInfo:[],
            roadId:1,
            // id:1,
            // fields:{
            //     id:0,
            //     zebracrossingId:1,
            //     workOrder:'',
            //     sectionsDescribe:'',
            //     location:'',
            //     ownerName:'',
            //     constructionSide:'',
            //     maintaining:'',
            //     operateId:0,
            //     customerId:0,
            //     // createTime:''
            // },
            fields:{},
            Action:0,
        };
    }
    //函数

    componentWillMount(){
       const { zebracrossingId } = this.props;
       this.getInitial();
       this.getOwnerName();
       this.getZebraOwnerInfo({zebracrossingId});
    };

    componentWillReceiveProps(nextProps) {
        if (this.props.zebracrossingId !== nextProps.zebracrossingId) {
            this.getZebraOwnerInfo({ zebracrossingId: nextProps.zebracrossingId });
        }
    }

    getInitial(){
        this.token = getToken();
        console.log("getToken");
        // console.log(this.token.session);
        this.state.session = this.token.session;
        this.state.account = this.token.account;
        this.state.customerId = this.token.customerId;
        console.log(this.token);
        // this.id = this.token.id;
        this.operateId = this.token.id;


    }
    //拿到表单初始化信息
    getZebraOwnerInfo = (zebracrossingId) => {
        console.log("getZebraOwnerInfo");
        servers.getBanMaLineOwnerList(zebracrossingId).then(res => {
            console.log("getBanMaLineOwnerList---------");
            console.log(res.result);
            console.log(res);
            console.log("getBanMaLineOwnerList---------");
            if (res.result == 200) {
                if(res.data){
                    this.setState({ Action:1,fields:res.data[0] });
                    console.log("this.state.fields");
                    console.log(this.state.fields);
                }else {
                    this.setState({ Action:0,fields: {} });
                }
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
//拿到业主选项
    getOwnerName = () =>{
        console.log("getOwnerName");
        servers.getOwnerList({customerId:this.state.customerId}).then(res=>{
            console.log(res);
            if(res.result==200){
                res.data ? this.setState({ ownerNameInfo: res.data, }) : this.setState({ ownerNameInfo: [] });
                console.log(this.state.ownerNameInfo+'getOwnerName----------');
            }else{
                const args = {
                    message: '通信失败',
                    description: res.message,
                    duration: 2,
                };
                notification.error(args);
            }
        });

    };

    renderOptions = () =>{
        console.log("renderOptions");
        const data = this.state.ownerNameInfo;
        console.log(data);
        if(data!={}){
            return data.map((item)=>{
                console.log("Options");
                return (<Option value={item.ownerName} key={item.id}>{item.ownerName}</Option>)
            });
        }else{
            return null;
        }
    };

    handleSubmit = (e) =>{
        // const f = this.props.getFieldValue();
        console.log("handleSubmit");
        // console.log(f);
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            const { zebracrossingId } = this.props;
            const { id } = this.state.field;
            if (id) values.id = id;
            values.zebracrossingId = zebracrossingId;
            values.Action = id ? 1 : 0;
            if (!err) {
                servers.modifyBanMaLineOwnerInfo({
                    ...values,
                    ownerName:this.state.fields.ownerName,
                    customerId: this.customerId,
                }).then(res => {
                    let { result, message } = res;
                    console.log("res");
                    console.log(res.result);
                    if (result == 200) {
                        const args = {
                            message: '提交成功',
                            description: message,
                            duration: 2,
                        };
                        notification.success(args);
                        this.getZebraOwnerInfo();
                    console.log(2);
                    } else {
                        const args = {
                            message: '提交失败',
                            description: message,
                            duration: 2,
                        };
                        notification.error(args);
                    }
                    console.log(3);
                })
            }
        })
    };

    deleteOwner = () =>{
        servers.deleteBanMaLineOwnerInfo({id:26}).then(res => {
            let { result, message } = res;
            console.log("res");
            console.log(res.result);
            if (result == 200) {
                const args = {
                    message: '删除成功',
                    description: message,
                    duration: 2,
                };
                notification.success(args);
                console.log(2);
            } else {
                const args = {
                    message: '删除失败',
                    description: message,
                    duration: 2,
                };
                notification.error(args);
            }
            console.log(3);
        })
    };


    select = (value) =>{
        console.log(value);
        this.setState({fields:{ownerName:value}});
    };

    handleFormChange = (changedFields) => {
        this.setState(({ fields }) => ({
            fields: { ...fields, ...changedFields },
        }));
    };


    //render函数
    render()
        {
            const { sectionsDescribe, location, ownerName, constructionSide , maintaining} = this.state.fields;
            // console.log("render");
            // console.log(ownerName);
            const ownerNameInfo = this.state.ownerNameInfo;
            const {getFieldDecorator} = this.props.form;
            const formItemLayout = {
                labelCol: {
                    xs: {span: 24},
                    sm: {span: 8},
                },
                wrapperCol: {
                    xs: {span: 24},
                    sm: {span: 8},
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
                <div style={{marginTop: 10}}>
                    <h1>业主信息</h1>
                    <Form onSubmit={this.handleSubmit}>
                        {/*</div>*/}
                        <div style={{marginTop: 10 }}>
                            {/*<Form onSubmit={this.handleSubmit}>*/}
                            {/*<Form >*/}
                            {/*<FormItem*/}
                            {/*{...formItemLayout}*/}
                            {/*label="施工单号"*/}
                            {/*>*/}
                            {/*{getFieldDecorator('workOrder', {*/}
                            {/*initialValue:this.state.fields.workOrder,*/}
                            {/*rules: [{*/}
                            {/*required: true, message: '请输入有效的施工任务!',*/}
                            {/*}],*/}
                            {/*})(*/}
                            {/*<Input  />*/}
                            {/*)}*/}
                            {/*</FormItem>*/}

                            <FormItem
                                {...formItemLayout}
                                label="路段描述"
                            >
                                        {getFieldDecorator('sectionsDescribe', {
                                            initialValue :  sectionsDescribe,
                                            rules: [{
                                                required: true, message: '请输入有效的路段描述!',
                                            }],

                                        })(

                                            <Input />
                                        )}

                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label="位置信息"
                            >
                                {getFieldDecorator('location', {
                                    initialValue :  location,
                                    rules: [{
                                        required: true, message: '请输入有效的位置信息!',
                                    }],
                                })(
                                    <Input />
                                )}
                            </FormItem>
                            <FormItem
                            {...formItemLayout}
                            label="业主名称"
                            >
                            {getFieldDecorator('ownerName', {
                                initialValue :  ownerName,
                            rules: [ {
                            required: true, message: '请输入有效的业主名称!',
                            }],
                            })(
                            <Select style={{ width: 450 }} onChange={this.select} >
                                {this.renderOptions()}
                            </Select>
                            )}
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label="施工方"
                            >
                                {getFieldDecorator('constructionSide', {
                                    initialValue :  constructionSide,
                                    rules: [{
                                        required: true, message: '请输入有效的施工方!',
                                    }],
                                })(
                                    <Input />
                                )}
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label="维护方"
                            >
                                {getFieldDecorator('maintaining', {
                                    initialValue :  maintaining,
                                    rules: [{
                                        required: true, message: '请输入有效的维护方!',
                                    }],
                                })(
                                    <Input/>
                                )}
                            </FormItem>

                            {/*button需要在form内，并设置htmlType类型为submit*/}
                            <FormItem {...tailFormItemLayout}>
                                <div>
                                <span> <Button type="primary" htmlType="submit" onClick={this.handleSubmit}>保存</Button></span>
                                <span style={{marginLeft:10}}><Button type="primary" htmlType="button" onClick={this.deleteOwner}  >删除</Button></span>
                                </div>
                            </FormItem>

                        </div>
                    </Form>


                </div>
            );
        };

}

const mapState = (state) => {
    //console.log(state)
    return {
        account: state.auth.user.account,
    }
}

const OwnerInfoForm = connect(mapState)(Form.create({
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
})(ownerInfoForm));

export default OwnerInfoForm