/*富贵钱包测试*/
const API = 'https://www.easy-mock.com/mock/5cdb712347cdea02cc1c7591/react';
export default {

  /*登陆*/
  /*提交登陆
  * login/sign/{cell}/{code}
  * login/login
  * */
  login_sign_in: `${API}/login/sign/`,
  /*获取登陆验证码
    * login/send/{cell}
    * */
  login_send_msg: `${API}/login/send/`,

  /*银行卡-获取银行卡列表*/
  bank_card_list: `${API}/card/bankCodeList`,
  /*银行卡-发送验证码*/
  bank_send_msg: `${API}/card/send`,
  /*银行卡-签约认证*/
  bank_sign_in: `${API}/card/sign`,
  /*银行卡-获取卡片信息*/
  bank_get_info: `${API}/card/getClientCard`,


  /*信息认证*/
  /*实名认证*/
  client_auth_cert: `${API}/client/certification`,
  /*实名认证*/
  client_cert_upload: `${API}/oss/signature/`,
  /*认证提交*/
  client_auth_submit: `${API}/client/submit`,
  /*认证信息获取*/
  client_auth_get: `${API}/client/getClientInfo`,
  /*客户电话号码*/
  client_service_cell: `${API}/client/getServiceCell`,
  /*认证信息获取*/
  client_contact_upload: `${API}/client/link`,


  /*借款&账单*/
  /*借款记录*/
  loan_info: `${API}/loan/getLoan`,
  /*借款记录*/
  overdue_info: `${API}/loan/getOverLoan`,
  /*借款记录*/
  loan_record:`${API}/loan/getLoanByClientNo`,
  /*借款详情——非逾期*/
  loan_detail:`${API}/loan/getLoanByLoanNo`,
  /*借款详情——逾期*/
  loan_detail_overdue:`${API}/loan/getOverLoan`,
  /*借款协议*/
  loan_agreement:`${API}/loan/getLoanAttach`,
  /*获取借款额度列表*/
  loan_limit: `${API}/loan/getTopLimit`,
  /*借款提交*/
  loan_submit: `${API}/loan/create`,
  /*借款确认*/
  loan_confirm: `${API}/loan/fee`,

  /*OCR正面*/
  ocr_cert_front: `${API}/oss/face`,
  ocr_cert_back: `${API}/oss/back`,

  /*版本更新*/
  version_check_url: `${API}/version/getVersion`,

  /*初始化还款的卡和微信还款二维码*/
  repay_info: `${API}/card/getLendCard`,

  /*银行卡扣款*/
  repay_submit: `${API}/loanBacked/loanSettl`,

  /*上传转账凭证*/
  upload_repay_url: `${API}/oss/uploadBackPicFile`,
}

