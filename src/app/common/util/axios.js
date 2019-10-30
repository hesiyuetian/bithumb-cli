import axios from 'axios'
import {User} from './user'
let USER = new User();

import { Loadings } from '../../components/loadings/loadings';
import { CONFIG } from './config'
let load = new Loadings();


let axiosIns = axios.create({});
axios.defaults.headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
};

axiosIns.defaults.responseType = 'json';

axiosIns.defaults.validateStatus = function (status) {
  return true;
};
axiosIns.interceptors.request.use( config => {
  if(USER.token()) config.headers['Authorization'] = `Bearer ${USER.token()}`;
  if(config.data && config.data.sig) config.headers['sig'] = config.data.sig, delete config.data.sig;
  config.headers['channel'] = CONFIG.channel;
  if(config.data && config.data.channel) delete config.data.channel;
  config.headers['language'] = USER.getItem('language') == 'en' ? 'en ' : 'zh_CN';
  return config;
});

axiosIns.interceptors.response.use(function (response) {
  let data = response.data;
  let status = response.status;
  if (data && status === 200) {
    if (data.status === 401) {
      USER.logout()
    }
    return Promise.resolve(response);
  } else {
    load.hide();
    load.tipErrorShow('Network Error');
    return Promise.reject(response);
  }
});

let ajaxMethod = ['get', 'post'];
let api = {};
let timeout = {
  timeout: 120000,
};

ajaxMethod.forEach((method)=> {
  api[method] = (uri,data,config) => {
    return new Promise(function (resolve, reject) {

      axiosIns[method](uri,data,config).then((response)=> {
        if (response.status) {
          resolve(response);
        } else {
          resolve(response);
        }
      }).catch((response)=> {
        reject(response)
      })
    })
  }
});

let axiosService = (params) => {
  if(params.method === 'get'){
    return new Promise((resolve, reject) => {
      api.get(params.url,{params: params.params},timeout).then( res => {
        resolve(res)
      })
    })
  }else{
    return new Promise((resolve, reject) => {
      api.post(params.url,params.data,timeout).then( res => {
        resolve(res)
      })
    })
  }
};

export default axiosService;

