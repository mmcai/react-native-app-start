import {request, api} from '../utils/index';

const {client_auth_get, client_service_cell, loan_info, overdue_info} = api;

export function Client_auth_get(data) {
  return request({
    url: client_auth_get,
    // method: 'get',
    data,
  })
}

/*借款信息*/
export function Init_loan_info(data) {
  return request({
    url: loan_info,
    data,
  })
}


/*借款信息*/
export function Init_overdue_info(data) {
  const url = `${overdue_info}/${data.loanNo}`;
  return request({
    url: url,
    data,
  })
}

/*借款信息*/
export function Client_service_cell(data) {
  return request({
    url: client_service_cell,
    data,
  })
}

