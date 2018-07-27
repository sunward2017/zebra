import React from 'react';
import { Form, Cascader, Select, notification, Divider, Row, Col, Button, Card} from 'antd';
import servers from '@/server'
import InspectionForm from '../Inspection/InspectionForm';
import FeedCard from '../QualityFeedBack';
import Repair from '../Repair';
import Completed from '../Completed'
import ZebraDev from '../ZebraDev'
import ZebraMate from '../ZebraMate'

const FormItem = Form.Item;
const Option = Select.Option;

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

const noticeErrInfo = (res) => {
  const args = {
    message: '通信失败',
    description: res.message,
    duration: 2,
  };
  notification.error(args);
}

class HorizontalLoginForm extends React.Component {

  state = {
    options: [],
    crossingList: [],
    zebraCrossingList: [],
    fields: [],
  }

  componentDidMount() {
    this.getDistrictTree();
    this.props.onRef(this);
  }

  hasError = () => {
    this.props.form.validateFields();
    const { getFieldsError } = this.props.form;
    return hasErrors(getFieldsError())
  }

  getDistrictTree = () => {
    servers.getAreaInfoTree().then(res => {
      if (res.result === 200) {
        const areaInfoList = res.data.areaInfoList[0];
        const options = [JSON.parse(JSON.stringify(areaInfoList).split('cityName').join('label').split('cityId').join('value').split('areaInfoList').join('children'))];
        this.setState({ options })
      }else{
        noticeErrInfo(res); noticeErrInfo(res);        
      }
    }).catch(
      err => { console.log(err) }
    )
  }
  areaChange = (v, item) => {
    const { id, value } = item[item.length - 1];
    this.getRoadSetInfoList({ id, areaId: value })
  }

  roadChange = (v) => {
    this.getCrossingList({ roadId: v })
  }

  zebraChange = (v) => {
    this.props.changeZebra(v);
  }

  getRoadSetInfoList = (nodeData) => {
    servers.getRoadSetInfoList(nodeData).then(res => {
      if (res.result === 200) {
        res.data ? this.setState({ crossingList: res.data }) : this.setState({ crossingList: [] });
        this.props.form.setFieldsValue({
          roadId: '',
          zebracrossingId: ''
        });
      } else {
        noticeErrInfo(res); noticeErrInfo(res);
      }
    }).catch(
      err => { console.log(err) }
    )
  }
  getCrossingList = (data) => {
    servers.getBanMaLineListinfo(data).then(res => {
      if (res.result === 200) {
        res.data ? this.setState({ zebraCrossingList: res.data }) : this.setState({ zebraCrossingList: [] });
        this.props.form.setFieldsValue({
          zebracrossingId: ''
        });
      } else {
        noticeErrInfo(res);
      }
    }).catch(
      err => { console.log(err) }
    )
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { crossingList, zebraCrossingList } = this.state;

    return (
      <Form layout="inline" onSubmit={this.handleSubmit}>
        <FormItem
          label="地区"
        >
          {getFieldDecorator('area', {
            rules: [{ required: true, message: '请选择地区' }],
          })(
            <Cascader style={{ width: 300 }} options={this.state.options} onChange={this.areaChange} />
          )}
        </FormItem>
        <FormItem
          label="路口"
        >
          {getFieldDecorator('roadId', {
            rules: [{ required: true, message: '请选择路口' }],
          })(
            <Select style={{ width: 200 }} onChange={this.roadChange}>
              {
                crossingList.map(crossing => (<Option key={crossing.id} value={crossing.id}>{crossing.roadName}</Option>))
              }
            </Select>
          )}
        </FormItem>
        <FormItem
          label="斑马线"
        >
          {getFieldDecorator('zebracrossingId', {
            rules: [{ required: true, message: '请选择斑马线' }],
          })(
            <Select style={{ width: 200 }} onChange={this.zebraChange}>
              {
                zebraCrossingList.map((crossing, index) => (<Option key={index} value={crossing.id}>{crossing.zebracrossingName}</Option>))
              }
            </Select>
          )}
        </FormItem>
      </Form>
    );
  }
}

const SearchReportForm = Form.create()(HorizontalLoginForm);

export class Inspection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      type: '',
      zebracrossingId: '',
      field: {},
    }

  }

  onRef = (ref) => {
    this.child = ref;
  }
  changeReport = (type) => {
    const err = this.child.hasError()
    if (!err) {
      this.setState({ type })
    }
  }
  changeZebra = (v) => {
    this.setState({ zebracrossingId: v })
  }

  getReport = () => {
    const { type, zebracrossingId } = this.state;
    switch (type) {
      case 'Inspection':
        return <InspectionForm zebracrossingId={zebracrossingId}/>;
      case 'feedBack':
        return <FeedCard zebracrossingId={zebracrossingId} />
      case 'repair':
        return <Repair zebracrossingId={zebracrossingId} />
      case 'completed':
        return <Completed zebracrossingId={zebracrossingId} />
      case 'zebraDev':
        return <ZebraDev zebracrossingId={zebracrossingId} />
      case 'zebraMate':
        return <ZebraMate zebracrossingId={zebracrossingId} />
      default:
        return null;
    }
  }

  render() {
    const btn = {
      marginTop: 30
    }
    return (
      <div>
        <h2>运营管理</h2>
        <Divider dashed />
        <SearchReportForm changeZebra={this.changeZebra} onRef={this.onRef} />
        <Divider />
        <Row gutter={16}>
          <Col span={4}>
            <Card style={{ textAlign: 'center' }}>
              <Button
                style={btn}
                icon="file-word"
                type="primary"
                onClick={() => { this.changeReport('zebraDev') }}
              >
                设备清单
               </Button>
              <br />
              <Button
                style={btn}
                icon="file-word"
                type="primary"
                onClick={() => { this.changeReport('zebraMate') }}
              >
                物料清单
               </Button>
              <br />
              <Button
                style={btn}
                icon="file-word"
                type="primary"
                onClick={() => { this.changeReport('completed') }}
              >
                竣工单
               </Button>
              <br />
              <Button
                style={btn}
                icon="file-word"
                type="primary"
                onClick={() => { this.changeReport('Inspection') }}
              >
                验收单
              </Button>
              <br />
              <Button
                style={btn}
                icon="file-word"
                type="primary"
                onClick={() => { this.changeReport('feedBack') }}
              >
                反馈单
               </Button>
              <br />
              <Button
                style={btn}
                icon="file-word"
                type="primary"
                onClick={() => { this.changeReport('repair') }}
              >
                返修单
               </Button>
            </Card>
          </Col>
          <Col span={20}><Card title={this.state.title}>{this.getReport()}</Card></Col>
        </Row>
      </div>
    )
  }
}

