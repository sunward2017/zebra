import React from 'react';
import { Input, Icon, notification } from 'antd'


export default class EditableCell extends React.Component {
  state = {
    value: this.props.value,
    editable: false,
  }
  
  handleChange = (e) => {
    const value = e.target.value;
    this.setState({ value });
  }
  
  check = () => {
    let { value } = this.state;
    const reg = new RegExp("^[ ]+$");
    if(!value ||  reg.test(value) ) {
      notification.warning({
        message: '提示：',
        description: '输入不能为空!',
      });
      return;
    }
    this.setState({ editable: false });
    this.props.onChange(value);
  }
  
  edit = () => {
    this.setState({ editable: true });
  }
  
  render() {
    const { value, editable } = this.state;
    const { width } = this.props;
    return (
      <React.Fragment>
        {
          editable ? (
            <Input
              style={{width:width}}
              value={value}
              onChange={this.handleChange}
              onPressEnter={this.check}
              suffix={(
                <Icon
                  type="check"
                  className="editable-cell-icon-check"
                  onClick={this.check}
                />
              )}
            />
          ) : (
            <div className="editable-cell">
              {value}
              <Icon
                type="edit"
                className="editable-cell-icon"
                onClick={this.edit}
              />
            </div>
          )
        }
      </React.Fragment>
    );
  }
}