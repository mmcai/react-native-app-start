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
import Pdf from 'react-native-pdf';

type Props = {};
@connect(({app, loading, NSLoan}) => ({app, loading, NSLoan}))
export default class LoanDetails extends Component<Props> {
  static navigationOptions = (navigation) => {
    console.log(navigation);
    return {
      title: "借款协议"
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      source: null
    }
  }

  componentDidMount() {
    const loanNo = this.props.navigation.getParam('loanNo', null);
    if (loanNo !== null) {
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
        /*PDF赋值*/
        if (res.success) {
          const data = res.result[0];
          const url = data.contractUrl;
          this.setState({
            source: url
          });
        }
      }
    });
  }


  render() {
    const {source} = this.state;
    let url = source;
    if (source != null) {
      const s = source.indexOf('PROTOCOL');
      const e = source.indexOf('?');
      /*测试地址*/
      // url = `http://fugui.zhanhaijingji.com/${source.substring(s, e)}`;
      /*线上地址*/
      url = `http://file.ugowang.com/${source.substring(s, e)}`;
    }
    return (
      <SafeAreaView style={styles.container}>
        <Pdf
          // source={{uri: "https://m.zhanhaijingji.cn/public/fgqb/a.pdf"}}
          source={{uri: url}}
          style={styles.pdf}/>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  pdf: {
    flex: 1,
    width
  }
});
