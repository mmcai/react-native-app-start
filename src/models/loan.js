import {
  Loan,
  Loan_info,
  Loan_limit,
  Loan_fee,
  Loan_record,
  Loan_details,
  Loan_details_overdue,
  Loan_agreement
} from '../services/loan';

export default {
  namespace: 'NSLoan',
  state: {
    name: 'NSLoan',
    loan: null,
    loanLimit: [],
    LoanFee: {},
    LoanRecord: [],
    loanDetail: {},
    loanDetailOverdue:{},
    loanAgreement: null
  },
  reducers: {
    redu_loan_record(state, {payload}) {
      return {
        ...state,
        LoanRecord: payload
      }
    },
    redu_loan_agreement(state, {payload}) {
      return {
        ...state,
        loanAgreement: payload
      }
    },
    redu_loan_details(state, {payload}) {
      return {
        ...state,
        loanDetail: payload
      }
    },
    redu_loan_details_overdue(state, {payload}) {
      return {
        ...state,
        loanDetailOverdue: payload
      }
    },
    redu_loan_limit(state, {payload}) {
      return {
        ...state,
        loanLimit: payload
      }
    },
    redu_loan_info(state, {payload}) {
      return {
        ...state,
        loan: payload
      }
    },
    redu_loan_fee(state, {payload}) {
      return {
        ...state,
        LoanFee: {...payload}
      }
    }
  },
  effects: {
    * loan_create({payload, callback}, {put, call}) {
      /*借款*/
      const res = yield call(Loan, {...payload});
      if (res.success) {
        if (callback && typeof callback === 'function') {
          callback(res);
        }
      }
    },
    * loan_agreement({payload, callback}, {put, call}) {
      /*借款*/
      const res = yield call(Loan_agreement, {...payload});
      if (res.success) {
        if (callback && typeof callback === 'function') {
          callback(res);
        }

        yield put({type: 'redu_loan_agreement', payload: res.result});
      }
    },
    * loan_limit({payload, callback}, {put, call}) {
      /*借款*/
      const res = yield call(Loan_limit, {...payload});
      if (res.success) {
        if (callback && typeof callback === 'function') {
          callback(res);
        }
        yield put({type: 'redu_loan_limit', payload: res.result});
      }
    },
    * loan_record({payload, callback}, {put, call}) {
      /*借款记录*/
      const res = yield call(Loan_record, {...payload});
      if (res.success) {
        if (callback && typeof callback === 'function') {
          callback(res);
        }
        yield put({type: 'redu_loan_record', payload: res.result});
      }
    },
    * loan_detail({payload, callback}, {put, call}) {
      /*借款记录*/
      const res = yield call(Loan_details, {...payload});
      if (res.success) {
        if (callback && typeof callback === 'function') {
          callback(res);
        }
        yield put({type: 'redu_loan_details', payload: res.result});
      }
    },
    * loan_detail_overdue({payload, callback}, {put, call}) {
      /*借款记录*/
      const res = yield call(Loan_details_overdue, {...payload});
      if (res.success) {
        if (callback && typeof callback === 'function') {
          callback(res);
        }
        yield put({type: 'redu_loan_details_overdue', payload: res.result});
      }
    },
    * loan_info({payload = {}, callback}, {put, call}) {
      /*借款记录*/
      const res = yield call(Loan_info, {...payload});
      if (res.success) {
        if (callback && typeof callback === 'function') {
          callback(res);
        }
        yield put({type: 'redu_loan_info', payload: res.result});
      }
    },
    * loan_fee({payload, callback}, {put, call}) {
      /*借款计算服务费*/
      const res = yield call(Loan_fee, {...payload});
      if (res.success) {
        if (callback && typeof callback === 'function') {
          callback(res.result);
        }
      }
    }
  }
};
