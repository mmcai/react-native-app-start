import {request, api} from '../utils/index';

const {
  loan_info,
  loan_confirm,
  loan_submit,
  loan_limit,
  loan_record,
  loan_detail,
  loan_detail_overdue,
  loan_agreement
} = api;

/*借款协议*/
export function Loan_agreement(data) {
  const url = `${loan_agreement}/${data.loanNo}`;
  return request({
    url: url,
    method: 'post',
    data,
  })
}

/*借款额度列表*/
export function Loan_limit(data) {
  return request({
    url: loan_limit,
    method: 'get',
    data,
  })
}

/*借款信息*/
export function Loan_info(data) {
  return request({
    url: loan_info,
    method: 'get',
    data,
  })
}

/*借款*/
export function Loan(data) {
  return request({
    url: loan_submit,
    method: 'post',
    data,
  })
}

/*借款确认——服务费*/
export function Loan_fee(data) {
  console.log(loan_confirm, '接口地址');
  return request({
    url: loan_confirm,
    method: 'post',
    data,
  })
}

/*借款记录*/
export function Loan_record(data) {
  return request({
    url: loan_record,
    method: 'get',
    data,
  })
}


/*借款详情-非逾期*/
export function Loan_details(data) {
  const url = `${loan_detail}/${data.loanNo}`;
  return request({
    url: url,
    method: 'get',
    data,
  })
}

/*借款详情-逾期*/
export function Loan_details_overdue(data) {
  const url = `${loan_detail_overdue}/${data.loanNo}`;
  return request({
    url: url,
    method: 'get',
    data,
  })
}
