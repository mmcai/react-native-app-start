import {Client_cert_upload, Client_auth_submit, Client_cert_submit} from '../services/auth';

export default {
  namespace: 'NSCommon',
  state: {
    name: 'NSCommon',
    uploadInfo: {},
  },
  reducers: {
    redu_upload_info(state, {payload}) {
      return {
        ...state,
        uploadInfo: {...payload}
      }
    }
  },
  effects: {
    * eff_upload_info({payload, callback}, {put, call}) {
      const res = yield call(Client_cert_upload, {...payload});
      if (res.success) {
        yield put({type: 'redu_upload_info', payload: res.result});
        if (callback && typeof callback === 'function') {
          callback(res);
        }
      }
    },
    * eff_cert_submit({payload, callback}, {put, call}) {
      const res = yield call(Client_cert_submit, {...payload});
      if (res.success) {
        if (callback && typeof callback === 'function') {
          callback(res);
        }
      }
    },
    * eff_auth_submit({payload, callback}, {put, call}) {
      const res = yield call(Client_auth_submit, {...payload});
      if (res.success) {
        if (callback && typeof callback === 'function') {
          callback(res);
        }
      }
    }
  },
  subscriptions: {}
};
