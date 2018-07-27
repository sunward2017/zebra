import axios from 'axios';
import { browserHistory } from 'react-router'
import { getToken } from './auth'
import { Modal } from 'antd';
import qs from 'qs'
import store from '@/store';
import { httpRequest } from '@/actions'

const confirm = Modal.confirm;


var whiteUrl = ['Login'];
axios.interceptors.request.use(function (config) {
  store.dispatch(httpRequest(true))
  if (config.url.indexOf(whiteUrl[0]) !== -1) {
    config.data = qs.stringify(config.data)
    return config;
  }
  let { session, account, userId, customerId } = getToken();
  if (config.method === "post") {
    config.data =config.data.customerId? qs.stringify({ ...config.data, cusId: customerId, curAccount:account,session, useId:userId }):qs.stringify({ ...config.data, cusId: customerId, curAccount:account,session,customerId, useId:userId })
  } else if (config.method === "get") {
    config.url += "?session=" + session + "&curAccount=" + account + '&cusId=' + customerId + '&userId=' + userId;
  }
  return config
}, function (error) {
  return Promise.reject(error);
});


axios.interceptors.response.use(function (res) {
  store.dispatch(httpRequest(false))
  const response = typeof (res.data) === "object" ? res.data : JSON.parse(res.data)
  if (response.result === 400) {
    confirm({
      title: '登录信息',
      content: '会话过期，请重新登录',
      onOk() {
        browserHistory.push("/login")
      },
      onCancel() { },
    });
  } else {
    return Promise.resolve(response);
  }

}, function (error) {
  let err = {
    success: false,
    error_msg: '系统错误，请稍后重试！'
  }
  return Promise.reject(error.response.data || err);
});

export default {
  request(options, cb) {
    options.method = options.method && options.method.toLocaleUpperCase();
    if (options.method === 'GET') {
      axios.get(options.url, {
        params: options.qs,
      }).then((res) => {
        cb(res.data)
      }).catch((err) => {
        cb(err);
      });
    } else if (options.method === 'POST') {
      axios.post(options.url, {
        ...options.qs
      }).then((res) => {
        cb(res);
      }).catch((err) => {
        console.log(err)
        cb(err);
      });
    }
  }

};
