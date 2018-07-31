import utils from '@/utils/http'
import urls from './url'


let obj = {};

const POST = (options = {}, url) => {
  return new Promise((resolve, reject) => {
    utils.request({
      method: 'POST',
      url: url,
      qs: options
    }, (data) => {
      resolve(data);
    });
  })
}

Object.keys(urls).forEach(item => {
  obj[item] = (options) => (POST(options, urls[item]))
})

export default obj;


