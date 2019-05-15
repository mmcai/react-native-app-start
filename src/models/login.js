import {login_sign, login_send} from '../services/login';
import {NavigationActions, Storage} from '../utils'
import Router from "../Router";


export default {
  namespace: 'NSLogin',
  state: {
    name: 'NSLogin',
    verifyCode: null,
    userInfo: {}
  },
  reducers: {
    redu_code(state, payload) {
      return {
        ...state,
        verifyCode: payload
      }
    },
    redu_sign(state, payload) {
      return {
        ...state,
        userInfo: payload
      }
    }
  },
  effects: {
    * login_get_code({payload, callback}, {put, call}) {
      const res = yield call(login_send, payload);
      if (res.success) {
        if (callback && typeof callback === 'function') {
          callback(res);
        }
      }
    },
    * login_sign_in({payload, callback}, {put, call}) {
      const res = yield call(login_sign, {...payload});
      if (res.success) {
        Storage.setValue("token", res.result);
        Storage.setValue("phone", payload.mobile);
        
        if (callback && typeof callback === 'function') {
          callback(res);
        }
      }
    }
  },
  subscriptions: {}
};
