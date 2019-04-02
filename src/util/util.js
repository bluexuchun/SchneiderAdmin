import axios from 'axios'
const qs = require('qs');

const baseURL = 'https://bang.schneider-electric.cn/academy/api/'
// const baseURL = 'https://homework.widiazine.cn/schneider/'

axios.defaults.baseURL = baseURL;

const uploadUrl = baseURL + 'api.php?entry=sys&c=account&a=upload';

export function ajaxTo(url,data){
  const requestUrl = url;
  return new Promise((resolve, reject) => {
    axios.post(requestUrl,qs.stringify(data))
    .then(function(res){
      console.log(res);
      if(res.status == 200){
        resolve(res.data);
      }
    })
    .catch(function(error){
      reject(error);
    })
  })
}

export default uploadUrl;
