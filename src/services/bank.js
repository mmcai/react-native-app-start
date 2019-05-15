import {request, api} from '../utils';

const {bank_get_info, bank_card_list, bank_send_msg, bank_sign_in} = api;

/*借款记录*/
export function bank_info(data) {
  return request({
    url: bank_get_info,
    method: 'get',
    data,
  })
}

/*借款*/
export function bank_msg_get(data) {
  return request({
    url: bank_send_msg,
    method: 'post',
    data,
  })
}

/*借款详情*/
export function bank_sign(data) {

  return request({
    url: bank_sign_in,
    method: 'post',
    data,
  })
}


export function bank_code_list(data) {
  return request({
    url: bank_card_list,
    method: 'get',
    data,
  })
}
