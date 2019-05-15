import {Client_auth_get, Client_service_cell, Init_loan_info, Init_overdue_info} from '../services/index';

export default {
  namespace: 'NSIndex',
  state: {
    user: {},
    loan: {},
    overdue: {}
  },
  reducers: {
    redu_new(state, {payload}) {
      return {
        ...state,
        ...payload,
        user: {...payload}
      }
    },
    redu_new_loan(state, {payload}) {
      return {
        ...state,
        loan: payload
      }
    },
    redu_overdue(state, {payload}) {
      return {
        ...state,
        overdue: {...payload}
      }
    }
  },
  effects: {
    * client_auth_get({payload, callback}, {put, call}) {
      const res = yield call(Client_auth_get, {...payload});
      if (res.success) {
        yield put({type: 'redu_new', payload: res.result});
        yield put({type: 'app/eff_app_updateUserInfo', payload: res.result});
        if (callback && typeof callback === 'function') {
          callback(res);
        }
      }
    },
    * client_service_cell({payload, callback}, {put, call}) {
      const res = yield call(Client_service_cell, {...payload});
      if (res.success) {
        yield put({type: 'app/eff_app_service_cell', payload: res.result});
      }
    },

    * init_loan_info({payload, callback}, {put, call}) {
      const res = yield call(Init_loan_info, {...payload});
      if (res.success) {
        yield put({type: 'redu_new_loan', payload: res.result});
        if (callback && typeof callback === 'function') {
          callback(res);
        }
      }
    },
    * init_overdue_info({payload, callback}, {put, call}) {
      const res = yield call(Init_overdue_info, {...payload});
      if (res.success) {
        yield put({type: 'redu_overdue', payload: res.result});
        if (callback && typeof callback === 'function') {
          callback(res);
        }
      }
    }
  }
};
