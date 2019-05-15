import axios from 'axios'
import Storage from "./storage";
import cloneDeep from 'lodash.clonedeep'
import pathToRegexp from 'path-to-regexp'
import Toast from "./toast";
import {FetchError} from '../common/error';

/*请求前处理*/
const myFetch = (options) => {
  let {
    method = 'get',
    data,
    url,
    token
  } = options;

  const cloneData = cloneDeep(data);


  try {
    let domain = '';
    if (url.match(/[a-zA-z]+:\/\/[^/]*/)) {
      [domain] = url.match(/[a-zA-z]+:\/\/[^/]*/);
      url = url.slice(domain.length);
    }
    const match = pathToRegexp.parse(url);

    url = pathToRegexp.compile(url)(data);
    for (let item of match) {
      if (item instanceof Object && item.name in cloneData) {
        delete cloneData[item.name]
      }
    }
    url = domain + url;
  }
  catch (e) {
    return false;
  }

  /*根据请求做switch判断*/
  switch (method.toLowerCase()) {
    case 'get':
      return axios.get(url, {
        params: cloneData,
        timeout: 100000,
        withCredentials: true,
        headers: {
          'x-auth-token': token
        }
      });
    case 'post':
      return axios.post(url, cloneData, {
        withCredentials: true,
        timeout: 100000,
        headers: {
          'x-auth-token': token
        }
      });
    default:
      return axios({
        ...options,
        timeout: 100000,
        headers: {
          'x-auth-token': token
        }
      })
  }
};


/*把请求函数暴露出去*/
export default async function request(options) {
  const token = await Storage.getValue('token');
  options = {...options, token};

  console.log('请求参数', {...options});

  /*请求之前的loading函数*/
  if (!options.data.show) {
    Toast.showLoading('加载中...')
  }


  return myFetch(options).then((response) => {
    Toast.hide();
    console.log(response, '返回结果');
    const {statusText, status} = response;
    let data = response.data;
    if (data instanceof Array) {
      data = {
        list: data,
      }
    }

    if (data.code === '500') {
      console.log('到这里500了', response);
      if (data.message === '用户未登录!') {
        Storage.removeValue('token');
        throw new FetchError(data.code * 1, '登录已失效，请重新登录');
      } else {
        throw new FetchError(data.code * 1, data.message);
      }

    }

    return Promise.resolve({
      success: true,
      message: statusText,
      statusCode: status,
      ...data,
    })
  }).catch((error) => {
    Toast.hide();
    const {response} = error;
    console.log('返回错误信息', error);
    let msg, statusCode, code;
    if (response && response instanceof Object) {
      const {data, statusText} = response;
      statusCode = response.status;
      msg = data.message || statusText;
      code = data.code || 500;
    } else {
      statusCode = error.code;
      code = error.code;
      msg = error.message || '网络超时'
    }

    return Promise.reject({
      success: false,
      statusCode,
      code,
      message: msg
    });
  })
}
