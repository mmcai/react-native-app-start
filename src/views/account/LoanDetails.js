import React, {Component} from 'react';
import {SafeAreaView} from 'react-navigation';
import {Platform, StyleSheet, ScrollView, Text, View} from 'react-native';
import connect from "react-redux/es/connect/connect";
import {width} from "../../utils/screen";
import {money} from "../../utils";
import moment from 'moment';
import Touchable from "../../components/Touchable";
import {Dialog} from "../../components";
import Line from "../../components/Line";
import Router from "../../Router";
import Button from "../../components/Button";
import Toast from "react-native-root-tips/lib/Toast";

type Props = {};
@connect(({app, loading, NSLoan}) => ({app, loading, NSLoan}))
export default class LoanDetails extends Component<Props> {
  static navigationOptions = (navigation) => {
    console.log(navigation);
    return {
      title: "借款详情"
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      loanNo: null,
      loanStatus: null,
      loanLimitData: null,
    }
  }

  componentDidMount() {
    const loanNo = this.props.navigation.getParam('loanNo', null);
    const status = this.props.navigation.getParam('status', null);
    if (loanNo !== null) {
      this.init(loanNo);
      if (status === "OVERDUED") {
        this.initOverdueInfo(loanNo);
      }
      this.setState({
        loanNo,
        loanStatus: status
      });

      /*初始化借款协议*/
      this.initLoanAgreement(loanNo);
    }
  }


  /*初始化可借额度列表,列表修改，更新相关服务费的信息*/
  initLoanAgreement(loanNo) {
    const {dispatch} = this.props;
    /*借款详情*/
    dispatch({
      type: 'NSLoan/loan_agreement',
      payload: {
        loanNo
      },
      callback: (res) => {
        console.log(res, '借款协议PDF数据');
        /*PDF赋值*/
        if (res.success) {
          this.setState({
            loanLimitData: res.result
          });
        } else {
          Toast.show("获取借款协议失败");
        }


      }
    });
  }

  /*非逾期的详情*/
  init(loanNo) {
    const {dispatch} = this.props;
    /*借款详情*/
    dispatch({
      type: 'NSLoan/loan_detail',
      payload: {
        loanNo
      }
    });
  }

  /*逾期的详情*/
  initOverdueInfo(loanNo) {
    const {dispatch} = this.props;
    /*借款详情*/
    dispatch({
      type: 'NSLoan/loan_detail_overdue',
      payload: {
        loanNo
      }
    });
  }


  render() {
    const {life} = this.props.app.user;
    const {loanNo, loanStatus, loanLimitData} = this.state;

    console.log(loanLimitData, '借款协议数据');
    let loanAmt, raiseAmt, startDate, status;
    const LoanDetails = this.props.NSLoan.loanDetail;
    startDate = LoanDetails.startDate;
    status = LoanDetails.status;
    raiseAmt = LoanDetails.raiseAmt;
    if (loanStatus !== null && loanStatus !== "OVERDUED") {
      loanAmt = LoanDetails.loanAmt;
    } else {
      const LoanOverDetails = this.props.NSLoan.loanDetailOverdue;
      loanAmt = LoanOverDetails.overdueAmt;
    }

    let RenderBtn;
    switch (status) {
      case "AUDITED":
      case "OVERDUED":
        RenderBtn = <View style={styles.footer}>
          <Button
            onPress={() => {
              if (loanStatus !== "OVERDUED") {
                this.props.navigation.navigate(Router.CASHIER, {status: "LOAN", source: "DETAIL"});
              } else {
                this.props.navigation.navigate(Router.CASHIER, {status: "OVERDUE", source: "DETAIL"});
              }
            }}
            style={styles.loanBtn}>去还款</Button>
        </View>;
        break;
    }

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={[styles.title]}>应还金额(元)</Text>
          <Text style={[styles.amount]}> {money(loanAmt)}</Text>
          <Text style={[styles.desc]}>及时结清，保持良好信用</Text>
        </View>
        <View style={styles.body}>
          <View style={styles.bTitle}>
            <Text>借款明细</Text>
          </View>
          <Line
            text='提现金额'
            border={true}
            extra={`${money(raiseAmt)}元`}
            style={styles.loanLine}
          />
          <Line
            text='提现时间'
            border={true}
            extra={`${moment(startDate).format("YYYY.MM.DD")}`}
            style={styles.loanLine}
          />
          <Line
            text='借款期限'
            border={true}
            extra={`${life}天`}
            style={styles.loanLine}
          />
          <Line
            text='借款协议'
            border={true}
            onPress={() => {
              //调转到借款协议
              this.props.navigation.navigate(Router.LOAN_ATTACH, {
                loanNo: loanNo
              });

              // this.props.navigation.navigate(Router.WEB, {
              //   title: "借款协议",
              //   // url: "https://m.zhanhaijingji.cn/public/fgqb/loanAgreement.html"
              //   url: loanLimitData[0].contractUrl
              // })

            }}
            arrow={false}
            extra={`查看`}
            extraStyle={{color: "#4C7BFE", fontSize: 15}}
            style={styles.loanLine}
          />
        </View>

        {/*底部按钮*/}
        {RenderBtn}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F5FA',
  },
  page: {},
  header: {
    height: 152,
    backgroundColor: "#FFF",
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10
  },
  title: {
    color: '#1E1E1E',
    fontSize: 16
  },

  amount: {
    color: '#EB4542',
    fontSize: 30,
    lineHeight: 34,
    margin: 0,
    padding: 0,
    marginVertical: 10
  },
  desc: {
    color: '#808080',
    fontSize: 12
  },
  /*借款明细*/
  body: {
    width: width
  },
  bTitle: {
    height: 30,
    backgroundColor: "#F4F5FA",
    paddingHorizontal: 15
  },

  /*还款按钮*/
  footer: {
    flex: 1,
    justifyContent: 'flex-end'
  },
  loanBtn: {
    borderRadius: 0,
    width,

  }
});
