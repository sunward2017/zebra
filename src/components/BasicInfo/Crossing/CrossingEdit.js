import React from 'react';
import { Modal, Button, Input, Form } from 'antd';
import { Map, Marker, NavigationControl, InfoWindow } from 'react-bmap';
import citys from '@/asset/data/citys'

class CrossingEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      record: this.props.record,
      visible: false,
      makerLng: 0,
      makerlat: 0,
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.onChange(Object.assign({}, this.props.record, values));
      }
    });
  }

  handleCancel = () => {
    this.props.onChange();
  }
  handleOk = () => {
    let { makerLng, makerLat } = this.state;
    this.props.form.setFieldsValue({
      longitude: makerLng,
      latitude: makerLat
    })
    this.setState({ visible: false })
  }
  handleBmap = () => {
    this.setState({ visible: true })
  }
  dblclick = (e) => {
    this.setState({ makerLng: e.point.lng, makerLat: e.point.lat });
  }
  render() {
    let { curCity, zebra, lng, lat } = this.props;
    if(curCity)curCity = (curCity.indexOf('市') == -1) ? (curCity + '市') : curCity;
    const center = citys[curCity] ? citys[curCity].split(',') : citys['北京市'].split(',');
    const { roadName, address, longitude, latitude, zebracrossingName } = this.state.record;
    const { getFieldDecorator } = this.props.form;

    const name = zebra ? 'zebracrossingName' : 'roadName';
    const { makerLng, makerLat } = this.state;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
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
          offset: 10,
        },
      },
    };
    return (
      <React.Fragment>
        <Modal title={zebra ? "斑马线信息" : "路口信息"} visible={true} onCancel={this.handleCancel} footer={null}>
          <Form onSubmit={this.handleSubmit}>
            <Form.Item label="名称" {...formItemLayout}>
              {getFieldDecorator(name, {
                rules: [{
                  required: true, message: '请输入名称!',
                }],
                initialValue: roadName || zebracrossingName
              })(
                <Input />
              )}
            </Form.Item>
            <Form.Item label="地址" {...formItemLayout}>
              {getFieldDecorator('address', {
                rules: [{
                  required: true, message: '请输入地址!',
                }],
                initialValue: address
              })(
                <Input />
              )}
            </Form.Item>
            <Form.Item label="经度" {...formItemLayout}>
              {getFieldDecorator('longitude', {
                initialValue: longitude || lng
              })(
                <Input disabled />
              )}
            </Form.Item>
            <Form.Item label="维度" {...formItemLayout}>
              {getFieldDecorator('latitude', {
                initialValue: latitude || lat
              })(
                <Input disabled />
              )}
            </Form.Item>
            <Form.Item {...tailFormItemLayout}>
              {!lng ? <Button type="primary" onClick={this.handleBmap}>坐标获取</Button> : null}
            </Form.Item>
            <Form.Item {...tailFormItemLayout}>
              <Button type="primary" htmlType="submit">提交</Button>
            </Form.Item>
          </Form>
        </Modal>
        <Modal
          title="坐标"
          width={800}
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}>
          <Map center={{ lng: center[0], lat: center[1] }} zoom="12" events={{ rightclick: this.dblclick }}>
            <Marker position={{ lng: makerLng, lat: makerLat }} />
            <NavigationControl />
          </Map>
        </Modal>
      </React.Fragment>
    )
  }
}
export default Form.create()(CrossingEdit);