import {Version_check_url} from "../services/app";

export default {
  namespace: 'app',
  state: {
    name: "APP的Modal",
    user: {
      //用户信息
    },
    bank: {
      //  银行卡信息
    },
    login: false,
    ServiceCell: null,
    Version: null
  },
  reducers: {
    redu_merge_user(state, {payload}) {
      return {
        ...state,
        user: {...payload}
      }
    },
    redu_merge_bank(state, {payload}) {
      return {
        ...state,
        bank: payload
      }
    },
    redu_merge_service_cell(state, {payload}) {
      return {
        ...state,
        ServiceCell: payload
      }
    },
    redu_merge_version(state, {payload}) {
      return {
        ...state,
        Version: payload
      }
    }
  },
  effects: {
    * eff_app_updateUserInfo({payload}, {call, put}) {
      yield put({type: 'redu_merge_user', payload});
    },
    * eff_app_service_cell({payload}, {call, put}) {
      yield put({type: 'redu_merge_service_cell', payload});
    },
    * eff_app_updateBankInfo({payload}, {call, put}) {
      yield put({type: 'redu_merge_bank', payload});
    },
    * eff_version_check({payload,callback}, {call, put}) {
      const res = yield call(Version_check_url, {...payload});
      yield put({type: 'redu_merge_version', payload: res.result});
      if (callback && typeof callback === 'function') {
        callback(res);
      }
    },
  },
  subscriptions: {
    /*  setup(data) {
        console.log(data);
        history.listen((location) => {
          const pathname = location.pathname;
          switch (pathname) {
            case "/agreement":
            case "/login":
            case "/":
              console.log("不去请求初始化接口");
              break;
            default:
              const payload = {};
              dispatch({
                type: 'eff_app_init',
                payload,
              });
              break;
          }
        })
      }*/
  }
}
