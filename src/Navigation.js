import Router from './Router';

/*样式布局页面*/
import MainScreen from './views/Layout';

/*引导页*/
import GuideScreen from './views/home/Boot';

/*HTML展示页面*/
import WebScreen from './views/home/Web';

/*登录页*/
import LoginScreen from './views/auth/Login';

/*个人中心*/
import HomeScreen from './views/home/Home';

import MyScreen from './views/account/My';

import BankScreen from './views/account/Bank'

import BankNewScreen from './views/account/BankNew'

import LoanRecordScreen from './views/account/LoanRecord';

import LoanDetailsScreen from './views/account/LoanDetails';

import QuotaScreen from './views/account/Quota'

import MessageScreen from './views/account/Message'

/*账单*/
import BillScreen from './views/bill/Bill'

import LoanResultScreen from './views/bill/LoanResult';

import CashierScreen from './views/bill/Cashier'

import LoanScreen from './views/bill/Loan'

import PayResultScreen from './views/bill/PayResult'

/*评估*/
import AssessScreen from './views/assess/Assess';

import AuthNameScreen from './views/assess/AuthName';
import Persional from './views/assess/Personal';

import UploadRes from './views/bill/UploadRes';

import LoanAttach from './views/account/LoanAttach';

const Navigator = {};

Navigator[Router.GUIDE] = GuideScreen;
Navigator[Router.WEB] = WebScreen;
Navigator[Router.MAIN] = MainScreen;
Navigator[Router.HOME] = HomeScreen;
Navigator[Router.LOGIN] = LoginScreen;
/*账单*/
Navigator[Router.BILL] = BillScreen;
Navigator[Router.UPLOADRES] = UploadRes;
Navigator[Router.LOAN_RESULT] = LoanResultScreen;
Navigator[Router.CASHIER] = CashierScreen;
Navigator[Router.LOAN] = LoanScreen;
Navigator[Router.PAYRESULT] = PayResultScreen;

/*评估*/
Navigator[Router.AEESEE] = AssessScreen;
Navigator[Router.AUTH_NAME] = AuthNameScreen;
Navigator[Router.PERSIONAL] = Persional;
/*个人中心*/
Navigator[Router.MY] = MyScreen;
Navigator[Router.QUOTA] = QuotaScreen;
Navigator[Router.MESSAGE] = MessageScreen;
Navigator[Router.LOAN_RECORD] = LoanRecordScreen;
Navigator[Router.LOAN_DETAILS] = LoanDetailsScreen;
Navigator[Router.BANK] = BankScreen;
Navigator[Router.BANKNEW] = BankNewScreen;
Navigator[Router.BILL] = BillScreen;
Navigator[Router.LOAN_ATTACH] = LoanAttach;


export default Navigator;
