import {request, api} from '../utils/index';

const {
  repay_info,
  repay_submit,
  upload_repay_url
} = api;

/*还款银行卡相关信息*/
export function Repay_info(data) {
  return request({
    url: repay_info,
    method: 'get',
    data,
  })
}

/*还款提交*/
export function Repay_submit(data) {
  return request({
    url: repay_submit,
    method: 'post',
    data,
  })
}


/*上传图片*/
export function Upload_repay_img(data) {
  return request({
    url: upload_repay_url,
    method: 'post',
    data,
  })
}
