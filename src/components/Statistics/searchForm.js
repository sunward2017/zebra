import React from 'react'
import { Form, Button, Select, DatePicker } from 'antd';
import moment from "moment"
import servers from '@/server'

const { RangePicker } = DatePicker;
const Option = Select.Option;

const FormItem = Form.Item;

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class HorizontalLoginForm extends React.Component {
  state={
    zebraCitys: [],
  }
  componentDidMount() {
    // To disabled submit button at the beginning.
   // this.props.form.validateFields();
    this.getArea(); 
  }
  getArea=()=> {
    let _this = this;
    servers.getAreaInfoTree().then(res => {
        if (res.result === 200) {
            if (res.data) {
                let area = res.data.areaInfoList.map(item => { return { id: item.cityId, name: item.cityName } });
                _this.setState({ zebraCitys: area })
                this.handleSubmit();
            }
        }
    })
}
  handleSubmit = (e) => {
    e && e.preventDefault();
    this.props.form.validateFields((err, fieldValues) => {
      if (!err) {
        let { handleGetResult } = this.props;
        const date = fieldValues['date'];
        const values = {
          cityId: fieldValues.city,
          strStartTime: date[0].format('YYYY-MM-DD HH:mm:ss'),
          strEndTime: date[1].format('YYYY-MM-DD HH:mm:ss'),
        }
        handleGetResult(values)
      }
    });
  }

  render() {
    const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
    const { zebraCitys } = this.state;
    const startTime = moment().subtract(1, 'day');
    const endTime = moment();
    const dateFormat = "YY-MM-DD HH:mm:ss";

    const cityError = isFieldTouched('city') && getFieldError('city');
    const dateError = isFieldTouched('date') && getFieldError('date');
    return (
      <Form onSubmit={this.handleSubmit} layout="inline" >
        <FormItem
          validateStatus={cityError ? 'error' : ''}
          help={cityError || ''}
        >
          {getFieldDecorator('city', {
            rules: [{ required: true, message: '请选择城市' }],
            initialValue: zebraCitys[0] ? zebraCitys[0].id : '',
          })(
            <Select
              showSearch
              style={{ width: 200 }}
              placeholder="城市选项"
              optionFilterProp="children"
              filterOption={(input, option) => option.props.children.indexOf(input) >= 0}
            >
              {zebraCitys.map((item, index) => (<Option key={index} value={item.id}>{item.name}</Option>))}
            </Select>
          )}

        </FormItem>
        <FormItem
          validateStatus={dateError ? 'error' : ''}
          help={dateError || ''}
        >
          {getFieldDecorator('date', {
            rules: [{ required: true, message: '请选择时间周期' }],
            initialValue: [moment(startTime, dateFormat), moment(endTime, dateFormat)]
          })(
            <RangePicker
              showTime={{ format: 'HH:mm:ss' }}
              format="YYYY-MM-DD HH:mm:ss"
              placeholder={['开始时间', '结束时间']}
              onChange={this.handleDateChange}
            />
          )}
        </FormItem>
        <FormItem>
          <Button
            ghost
            icon="search"
            type="primary"
            htmlType="submit"
            disabled={hasErrors(getFieldsError())}
          >
           查询 
          </Button>
        </FormItem>
      </Form>
    );
  }
}

const SearchForm = Form.create()(HorizontalLoginForm);
export default SearchForm;