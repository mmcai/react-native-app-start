import {request, api} from '../utils/index';

const {login_sign_in, login_send_msg} = api;

export function login_sign(data) {
  let url = `${login_sign_in}${data.mobile}/${data.verifyCode}`;

  return request({
    url: url,
    method: 'get',
    data,
  })
}

export function login_send(data) {
  let url = `${login_send_msg}${data.mobile}`;
  return request({
    url: url,
    method: 'get',
    data,
  })
}
