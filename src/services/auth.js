import {request, api} from '../utils';

const {
  client_contact_upload,
  ocr_cert_back,
  ocr_cert_front,
  client_auth_cert, client_auth_submit, client_cert_upload
} = api;


/*ocr正面*/
export function oss_cert_front(data) {
  return request({
    url: ocr_cert_front,
    method: 'get',
    data,
  })
}

/*ocr反面*/
export function oss_cert_back(data) {

  return request({
    url: ocr_cert_back,
    method: 'get',
    data,
  })
}

/*实名*/
export function Client_cert_submit(data) {
  return request({
    url: client_auth_cert,
    method: 'post',
    data,
  })
}

/*获取图片上传验签*/
export function Client_cert_upload(data) {
  const url = `${client_cert_upload}${data.fileType}/${data.fileName}`;
  return request({
    url: url,
    method: 'get',
    data,
  })
}

/*提交认证*/
export function Client_auth_submit(data) {
  return request({
    url: client_auth_submit,
    method: 'get',
    data,
  })
}


/*通讯录上报*/
export function Client_contact_submit(data) {
  return request({
    url: client_contact_upload,
    method: 'post',
    data,
  })
}
