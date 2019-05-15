import {
  Repay_info,
  Repay_submit,
  Upload_repay_img
} from '../services/cashier';

export default {
  namespace: 'NSCashier',
  state: {
    name: 'NSCashier',
    repay: {},
  },
  reducers: {
    redu_repay_info(state, {payload}) {
      return {
        ...state,
        repay: {...payload}
      }
    }
  },
  effects: {
    /*初始化扣款*/
    * eff_repay_submit({payload, callback}, {put, call}) {
      /*借款*/
      const res = yield call(Repay_submit, {...payload});
      if (callback && typeof callback === 'function') {
        callback(res);
      }
    },
    /*上传借款凭证*/
    * eff_upload_repay({payload, callback}, {put, call}) {
      /*借款*/
      const res = yield call(Upload_repay_img, {...payload});
      if (callback && typeof callback === 'function') {
        callback(res);
      }
    },
    /*初始化还款信息*/
    * eff_repay_info({payload, callback}, {put, call}) {
      const res = yield call(Repay_info, {...payload});
      if (res.success) {
        yield put({type: 'redu_repay_info', payload: res.result});
      }
    }
  }
};
