import {
  oss_cert_back,
  oss_cert_front,
  Client_cert_upload,
  Client_auth_submit,
  Client_cert_submit,
  Client_contact_submit,

} from '../services/auth';

export default {
  namespace: 'NSAuthName',
  state: {
    name: 'NSAuthName',
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
    /*正面*/
    * eff_upload_front({payload, callback}, {put, call}) {
      const res = yield call(oss_cert_front, {...payload});
      if (res.success) {
        if (callback && typeof callback === 'function') {
          callback(res);
        }
      }
    },
    /*反 面*/
    * eff_upload_back({payload, callback}, {put, call}) {
      const res = yield call(oss_cert_back, {...payload});
      if (res.success) {
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
    /*通讯录*/
    * eff_contact_submit({payload, callback}, {put, call}) {
      const res = yield call(Client_contact_submit, {...payload});
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
