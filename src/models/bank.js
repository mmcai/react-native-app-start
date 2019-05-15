import {bank_info, bank_code_list, bank_msg_get, bank_sign} from '../services/bank';

export default {
  namespace: 'NSBank',
  state: {
    name: 'NSBank',
    bankInfo: {},
  },
  reducers: {
    redu_bank_info(state, {payload}) {

      return {
        ...state,
        bankInfo: payload
      }
    }
  },
  effects: {
    * eff_bank_info({payload, callback}, {put, call}) {
      const res = yield call(bank_info, {...payload});
      if (res.success) {
        yield put({type: 'redu_bank_info', payload: res.result});
        yield put({type: 'app/eff_app_updateBankInfo', payload: res.result});

        if (callback && typeof callback === 'function') {
          callback(res);
        }
      }
    },
    * eff_bank_send({payload, callback}, {put, call}) {
      const res = yield call(bank_msg_get, {...payload});
      console.log(res);
      if (res.success) {
        if (callback && typeof callback === 'function') {
          callback(res);
        }
      }
    },
    * eff_bank_sign({payload, callback}, {put, call}) {
      const res = yield call(bank_sign, {...payload});
      if (res.success) {
        /*更新银行卡状态*/

        // yield put({type: 'NSBank/eff_bank_info', payload: res.result});
        // yield put({type: 'app/eff_app_updateBankInfo', payload: res.result});

        if (callback && typeof callback === 'function') {
          callback(res);
        }
      }
    },
    * eff_card_list({payload, callback}, {put, call}) {
      const res = yield call(bank_code_list, {...payload});
      if (res.success) {
        if (callback && typeof callback === 'function') {
          callback(res.result);
        }
      }
    },
  },
  subscriptions: {
    /* setup({dispatch, history}) {
       history.listen((location) => {
         const pathname = location.pathname;
         switch (pathname) {
           case "/loan":
           case "/cashier":
             const payload = {};
             dispatch({
               type: 'eff_bank_info',
               payload,
             });
             break;
         }
       })
     },*/
  }
};
