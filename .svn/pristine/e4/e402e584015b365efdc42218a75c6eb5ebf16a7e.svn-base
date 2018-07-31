import React from 'react';
import { Card, Steps, Avatar, Divider, Popconfirm, Button } from 'antd';
import ImgList from '@/common/ImgList'

const Step = Steps.Step;

function FeedCard(props) {

    const feed = (isShow, action, id, item) => { /*islast*/
        return isShow ? <span>
            <a href="javascript:;" onClick={() => { props.action(action) }}>{action}</a>
            <Divider type="vetical" />
            <a href="javascript:;" onClick={() => { props.edit(item) }}>修改</a>
            <Divider type="vetical" />
            <Popconfirm title="确定删除" onConfirm={() => { props.delQualityFeedback(id) }}>
                <a href="javascript:;">删除</a>
            </Popconfirm>
        </span> : <a href="javascript:;" onClick={() => { props.edit(item) }}>修改</a>
    }
    const card = (props) => {
        const { imgUuid } = props;
        return <Card>
            <div>{props.content || props.revertContent}</div>
            <div> {imgUuid ? <ImgList fuuid={imgUuid} align={{ gutter: 5, column: 8 }} /> : null}</div>
            <div style={{ textAlign: 'right' }}>{props.feedbackPerson || props.revertPerson}&emsp;{props.feedbackPerson ? props.createTime : props.revertDate}&emsp;{feed(props.isAction, props.action, props.id, props)}</div>
        </Card>
    }, { data } = props;

    if (data.length > 0) {
        return (
            <Steps direction="vertical" current={4} style={{ width: '90%', margin: '0 auto' }}>
                {data.map((item, index) => {
                    const title = item.title = item.feedbackPerson ? '反馈' : '回复';
                    const color = item.feedbackPerson ? "#87d068" : 'rgb(16,142,233)';
                    if ((++index) === data.length) { item.isAction = true; item.action = item.feedbackPerson ? '回复' : '反馈' }
                    return (
                        <Step key={index} title={title} description={card(item)} icon={<Avatar style={{ backgroundColor: color }} icon="user" />} />
                    )
                })}
            </Steps>
        )
    } else {
        return null;
    }
}

export default FeedCard;