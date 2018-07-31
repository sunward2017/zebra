import React, {PureComponent} from 'react';
import {Select} from 'antd';
import { Calendar , Badge, notification } from 'antd';
import { connect } from 'react-redux';
import servers from '@/server'
import {getToken} from '@/utils/auth'

const Option = Select.Option;

export default class WorkCalendar extends PureComponent {
    constructor(props){
        super(props);
        console.log("workCalender---constructor");
        console.log(props);
        this.state={
            listData:[],
            districValue:undefined,
            treeNodeData:[],
            crossingList:[],
            zebraCrossingList:[],
            customerId: '',
            monthArr:new Array(),
            dayArr:new Array(),
        };
    }
//    函数
    componentWillMount(){
        const { zebracrossingId } = this.props;
        this.getInitial();
        this.initialListData({ zebracrossingId });


    };

    componentWillReceiveProps(nextProps) {
        if (this.props.zebracrossingId !== nextProps.zebracrossingId) {
            this.initialListData({ zebracrossingId: nextProps.zebracrossingId });
        }
    }

    getInitial(){
        this.token = getToken();
        // console.log("getToken");
        // console.log(this.token.session);
        this.state.session = this.token.session;
        this.state.account = this.token.account;
        this.state.customerId = this.token.customerId;
        // console.log(this.token);
    }

     removeEmptyArrayEle =(arr)=>{
        for(var i = 0; i < arr.length; i++) {
            if(arr[i] == undefined) {
                arr.splice(i,1);
                i = i - 1; // i - 1 ,因为空元素在数组下标 2 位置，删除空之后，后面的元素要向前补位，
                // 这样才能真正去掉空元素,觉得这句可以删掉的连续为空试试，然后思考其中逻辑
            }
        }
        return arr;
    };

    initialListData=(values)=>{
        // console.log("initialListData");
       values.customId = this.state.customerId;
        servers.getWorkCalendar (values).then(res => {
            // console.log(res.data);
            if (res.result == 200) {
                res.data ? this.setState({ listData: res.data }) : this.setState({ listData: [] });
                let arr = new Array();
                let list = this.state.listData;
                list.map((item)=> {
                    const month = (new Date(Date.parse(item.createTime))).getMonth() + 1;
                    for (let i = 1; i < 13; i++) {
                        if (arr[i] == undefined) {
                            arr[i] = 0
                        }
                        if (i == month) {
                            arr[i] = arr[i] + 1;
                        } else {
                            arr[i] = arr[i];
                        }
                    }
                    this.removeEmptyArrayEle(arr);
                });
                this.setState({monthArr: arr});
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

    getListData=(value)=> {
        // console.log('getListData===========================');
        let vdate = value.date();
        let vmonth = value.month()+1;
        const listData = this.state.listData;
        let cellList = new Array();
        listData.map((item)=>{
           let month = (new Date(Date.parse(item.createTime))).getMonth() + 1;
            let date = (new Date(Date.parse(item.createTime))).getDate();
            let content = item.content;
           if(month == vmonth && vdate == date){
                   let obj = {};
                   obj.type='success';
                   obj.content = content;
                   cellList.push(obj);
           }else{}
        });
        // console.log(cellList);
       return cellList ||[]
    };

    dateCellRender=(value)=> {
        // console.log('dateCellRender');
        //day是一个数组
        const date = this.getListData(value);
        return  (
            <div style={{overflow:'hidden'}}>
                {
                    date.map(item => (
                        <li key={Math.random()}>
                            <Badge  status={item.type} text={item.content} />
                        </li>
                    ))
                }
            </div>
        );
    };

    getMonthData=(value)=> {
       // console.log("getMonthData");
       let mv = value.month();
       if(this.state.monthArr[mv]!=0){
        return this.state.monthArr[mv];
       }
    };

    monthCellRender=(value)=> {
        // console.log("monthCellRender");
        const month = this.getMonthData(value);
        return month ? (
            <div>
                <h1>{month}条事件</h1>
            </div>
        ) : null;

    };

//    render函数
    render(){

        return (
            <div style={{marginTop:10 }}>



                <div style={{marginTop:10 }}>
                <Calendar dateCellRender={this.dateCellRender} monthCellRender={this.monthCellRender}/>
                </div>
            </div>
        )
    };
}

