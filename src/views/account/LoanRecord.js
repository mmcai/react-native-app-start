import React, {Component} from 'react';
import {SafeAreaView} from 'react-navigation';
import {ScrollView, StyleSheet, Image, Text, View} from 'react-native';
import {connect} from "react-redux";
import {money} from '../../utils/filters'
import moment from 'moment';

import {Images} from "../../common/images";
import Router from "../../Router";
import {Touchable} from "../../components";
import {width} from "../../utils/screen";

type Props = {};
@connect(({app, loading, NSLoan}) => ({app, loading, NSLoan}))
export default class LoanRecord extends Component<Props> {
  static navigationOptions = (navigation) => {
    console.log(navigation);
    return {
      title: "我的借款"
    }
  };

  componentDidMount() {
    const {dispatch} = this.props;
    dispatch({
      type: 'NSLoan/loan_record',
      payload: {}
    });
  }


  constructor(props) {
    super(props);
    this.state = {}
  }

  render() {
    const {LoanRecord} = this.props.NSLoan;
    const {navigation} = this.props;

    /*暂无借款记录*/
    const RenderRecordNull = <View style={styles.LoanRecordNull}>
        <Image
          style={styles.nullImg}
          resizeMode={'contain'}
          source={Images.loan.Null}/>
        <Text style={styles.nullDesc}>暂无借款记录</Text>
      </View>
    ;


    /*借款子项*/
    let RenderLoanItem = LoanRecord && LoanRecord.map((item, key) => {

      console.log(item.status,'状态');

        // INIT("INIT", "新增借款"),
        // SUBMITED("SUBMITED", "审核中"),
        // RAISECONFIRM("RAISECONFIRM", "财务确认"),

        // AUDITED("AUDITED", "回款中"),

        // REPAYCONFIRM("REPAYCONFIRM", "还款确认"),
        // SETTLED("SETTLED", "已结清"),
        // OVERDUED("OVERDUED", "已逾期"),
        // CANCELED("CANCELED", "已作废"),

      let status = "";
      let panelCls = {};
      switch (item.status) {
        case "INIT":
        case "SUBMITED":
        case "RAISECONFIRM":
          status = "打款中";
          panelCls = styles.grey;
          break;
        case "AUDITED":
          status = "回款中";
          panelCls = styles.blue;
          break;
        case "REPAYCONFIRM":
          status = "还款处理中";
          panelCls = styles.grey;
          break;
        case "OVERDUED":
          status = "已逾期";
          panelCls = styles.warning;
          break;
      }

      return (
        <Touchable
          style={[styles.record]}
          key={key}
          onPress={() => {
            navigation.navigate(Router.LOAN_DETAILS, {
              status: item.status,
              loanNo: item.loanNo
            });
          }}>
          <View style={styles.rBody}>
            <View style={styles.rLeft}>
              <Text style={styles.rName}><Text>￥</Text>{money(item.unRemindAmt)}</Text>
              <Text style={styles.rMoney}>{moment(item.startDate).format('YYYY-MM-DD')}</Text>
            </View>
            <View style={styles.rRight}>
              <Text style={[styles.rStatus, panelCls]}>{status}</Text>
              <Image source={Images.common.ArrowRight}/>
            </View>
          </View>
        </Touchable>
      )
    })
    /*借款记录*/
    const RenderLoanList =
      <ScrollView style={styles.page}>
        <View style={styles.loanList}>
          {RenderLoanItem}
        </View>
      </ScrollView>
    ;


    /*借款记录*/
    let RenderRecord;
    if (LoanRecord && LoanRecord.length !== 0) {
      RenderRecord = RenderLoanList;
    } else {
      RenderRecord = RenderRecordNull
    }

    return (
      <SafeAreaView style={styles.container}>
        {RenderRecord}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F5FA"
  },
  page: {
    flex: 1,
    backgroundColor: "#F4F5FA"
  },
  loanList: {
    backgroundColor: "#F4F5FA"
  },
  record: {
    width,
    height: 66,
    backgroundColor: "#fff",
    marginBottom: 10
  },
  rBody: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: 15
  },
  rLeft: {
    flex: 1,
    justifyContent: 'center'
  },
  rRight: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  rName: {
    color: "#1E1E1E",
    fontSize: 16,
    lineHeight: 16,
    marginBottom: 10
  },
  rMoney: {
    color: "#BBBBBB",
    fontSize: 12,
    lineHeight: 12
  },
  rStatus: {
    fontSize: 16,
    color: "#24BFF2",
    marginRight: 10
  },
  blue: {
    color: "#4C7BFE",
  },
  grey: {
    color: "#BBBBBB",
  },
  warning: {
    color: "#EB4542",
  },

  /*没有借款信息*/
  LoanRecordNull: {
    flex: 1,
    paddingTop: 40,
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: "#FFF"
  },
  nullImg: {
    width: 281,
    height: 206,
    marginBottom: 30
  },
  nullDesc: {
    fontSize: 16,
    color: "#808080"
  },
});
