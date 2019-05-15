import React, {Component} from 'react';
import {SafeAreaView, StackActions, NavigationActions} from 'react-navigation';
import {Clipboard, StyleSheet, Text, Image, View} from 'react-native';
import connect from "react-redux/es/connect/connect";
import {Button, Touchable, Alert} from "../../components";
import {width, height} from '../../utils/screen'
import {money, Toast} from "../../utils";
import Router from "../../Router";
import _ from 'lodash';
import {Images} from "../../common/images";


type Props = {};
@connect(({app, loading, NSLoan, NSCashier, NSIndex, NSBank}) => ({app, loading, NSLoan, NSCashier, NSIndex, NSBank}))
export default class Cashier extends Component<Props> {

  static navigationOptions = (navigation) => {
    return {
      title: "还款"
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      repayMoney: 0,
      status: 'loan', // loan,overdue
      dialogWx: false, // 微信转账
      dialogChange: false,// 银行转账
      dialogCard: false,// 银行扣款
      payBody: 'all', // all,loan
      payMode: 'card', //wx,change
    }
  }

  componentWillMount() {
    /*获取url参数*/
    const status = this.props.navigation.getParam('status', null);
    const source = this.props.navigation.getParam('source', null);

    let overdueInfo, loanInfo;
    if (source !== "DETAIL") {
      overdueInfo = this.props.NSIndex.overdue;
      loanInfo = this.props.NSIndex.loan;
    } else {
      overdueInfo = this.props.NSLoan.loanDetailOverdue;
      loanInfo = this.props.NSLoan.loanDetail;
    }


    switch (status) {
      case "LOAN":
        this.setState({
          loanNo: loanInfo.loanNo,
          source: source,
          repayMoney: loanInfo.extensionAmt,
          payBody: 'loan',
          status: 'loan'
        });
        break;
      case "OVERDUE":
        this.setState({
          loanNo: overdueInfo.loanNo,
          source: source,
          repayMoney: overdueInfo.overdueAmt,
          payBody: 'all',
          status: 'overdue'
        });
        break;
    }
  }


  componentDidMount() {
    /*初始化银行卡信息*/
    this.initBankInfo();

    /*初始化还款相关的银行卡信息*/
    this.initRepayInfo();
  }

  initRepayInfo() {
    const {dispatch} = this.props;
    dispatch({
      type: "NSCashier/eff_repay_info",
      payload: {}
    })
  }

  initBankInfo() {
    const {dispatch} = this.props;
    dispatch({
      type: "NSBank/eff_bank_info",
      payload: {},
      callback: (res) => {
        if (res.success) {
          console.log('银行卡信息', res.data);
        }
      }
    })
  }


  submit() {
    const {dispatch} = this.props;
    const {repayMoney, payBody, loanNo} = this.state;
    dispatch({
      type: "NSCashier/eff_repay_submit",
      payload: {
        loanNo,
        backedAmt: repayMoney,
        loanBackType: payBody === 'all' ? 'SETTL' : 'EXTENSION',
        transferType: "PROTOCOL",
      },
      callback: (res) => {
        if (res.code === '200') {
          this.props.navigation.navigate(Router.PAYRESULT);
        } else {
          this.setState({
            dialogCard: false
          });

          Toast.show('您的操作失败次数过多，请选择其他方式！');
        }
      }
    });

  }


  render() {
    const {repayMoney, status, payBody, payMode, dialogCard, source, loanNo} = this.state;
    let overdue, loan;
    if (source === "DETAIL") {
      overdue = this.props.NSLoan.loanDetailOverdue;
      loan = this.props.NSLoan.loanDetail;
    } else {
      overdue = this.props.NSIndex.overdue;
      loan = this.props.NSIndex.loan;
    }
    const {repay} = this.props.NSCashier;
    const {bankInfo} = this.props.NSBank;

    const {openBankName, bankAccount4} = bankInfo;

    const {extensionAmt, loanAmt,raiseAmt} = loan;
    const {overdueAmt} = overdue;


    console.log(loan,'借款信息-------------');

    //还款选择
    const RenderRepay = <View style={styles.repayBox}>
      {/*展期还款*/}
      {status === 'loan' && <Touchable
        onPress={() => {
          this.setState({
            repayMoney: extensionAmt,
            payBody: "loan"
          })
        }}
        style={[styles.RepayItem, payBody === 'loan' ? styles.RepayBorder : {}]}>
        <View style={styles.RepayTitle}>
          <Image style={styles.reapyRadio}
                 source={payBody === 'loan' ? Images.cashier.payChoosed : Images.cashier.payChooseNull}/>
          <Text style={styles.Repayh2}>展期还款（元）</Text>
          <Text style={styles.RepayMoney}>{money(extensionAmt)}</Text>
        </View>
        <View style={styles.RepayContent}>
          <Text style={styles.repayDesc}>还款后结清本期借款</Text>
          <Text style={styles.repayDesc}>同时会自动为您生成下一次相同金额的借款</Text>
        </View>
      </Touchable>}

      {/*全部结清*/}
      <Touchable
        onPress={() => {
          this.setState({
            repayMoney: loanAmt,
            payBody: "all"
          })
        }}
        style={[styles.RepayItem, payBody === 'all' ? styles.RepayBorder : {}]}>
        <View style={styles.RepayTitle}>
          <Image style={styles.reapyRadio}
                 source={payBody === 'all' ? Images.cashier.payChoosed : Images.cashier.payChooseNull}/>
          <Text style={styles.Repayh2}>全部结清（元）</Text>
          <Text style={styles.RepayMoney}>{status === 'loan' ? money(loanAmt) : money(overdueAmt)}</Text>
        </View>
        <View style={styles.RepayContent}>
          <Text style={styles.repayDesc}>结清后可再次借款{raiseAmt}元</Text>
        </View>
      </Touchable>
    </View>;

    //微信弹框
    const dialogWxBody = <View style={styles.dialogWxBody}>
      <Text
        style={{marginBottom: 10, lineHeight: 25, fontSize: 18, color: '#4A4B5B'}}>应还金额：<Text
        style={{fontSize: 24, lineHeight: 25, color: '#FF604F'}}>{repayMoney}</Text>元</Text>
      <Text style={{fontSize: 15, color: '#4A4B5B'}}>转账时请备注姓名</Text>
      <Image style={{width: 230, height: 230, marginVertical: 10}}
             source={{uri: 'https://m.zhanhaijingji.cn/public/wxqrcode/2071.jpg'}}/>
      <Text style={{fontSize: 15, lineHeight: 21, color: '#4A4B5B'}}>转账成功后，请把转账截图给客服，以完成后续操作</Text>
    </View>;

    // 银行转账
    const RenderDialogChange = <View style={styles.dialogChangeBody}>
      <Text
        style={{marginBottom: 10, lineHeight: 25, textAlign: 'center', fontSize: 18, color: '#4A4B5B'}}>应还金额：<Text
        style={{fontSize: 24, lineHeight: 25, color: '#FF604F'}}>{repayMoney}</Text>元</Text>
      <View style={styles.dChangeLine}>
        <Text style={styles.dChangeLabel}>收款账户</Text>
        <Text style={styles.dChangeValue}>{repay.ownerName}</Text>
      </View>
      <View style={styles.dChangeLine}>
        <Text style={styles.dChangeLabel}>开户银行</Text>
        <Text style={styles.dChangeValue}>{repay.openBankName}</Text>
      </View>
      <View style={styles.dChangeLine}>
        <Text style={styles.dChangeLabel}>开户支行</Text>
        <Text style={styles.dChangeValue}>{repay.openSubBankName}</Text>
      </View>
      <View style={[styles.dChangeLine, {
        flexDirection: "column",
        justifyContent: 'center',
        alignItems: 'stretch',
        height: 68
      }]}>
        <Text style={styles.dChangeLabel}>银行卡号</Text>
        <View style={{flexDirection: 'row', height: 40, alignItems: 'center', justifyContent: 'space-between'}}>
          <Text style={styles.dChangeValue}>{repay.bankAccount}</Text>
          <Touchable onPress={() => {
            Clipboard.setString(repay.bankAccount);
            Toast.show('已复制');
          }}>
            <Text style={{color: "#EB4542", fontSize: 15}}>点击复制</Text>
          </Touchable>
        </View>

      </View>
      <View style={styles.dChangeFot}>
        <Text style={{fontSize: 15, lineHeight: 21, color: '#4A4B5B'}}>请在完成转账后，</Text>
        <Text style={{fontSize: 15, lineHeight: 21, color: '#4A4B5B'}}>保存截图，并点击“下一步”</Text>
      </View>

    </View>;

    return (
      <SafeAreaView style={styles.container}>
        {/*还款卡片*/}
        <View style={styles.cashierBox}>
          <View style={styles.topTips}>
            <Text style={styles.topTipsText}>以app提供还款信息为准，切勿相信任何个人提供的还款方式！</Text>
          </View>

          {/*还款选择*/}
          {RenderRepay}

          {/*支付*/}
          <View style={styles.payBox}>
            <View style={styles.payTitle}>
              <Text style={styles.payTitleText}>快捷支付</Text>
            </View>
            <Touchable
              onPress={() => {
                this.setState({
                  payMode: "card"
                })
              }}
              style={[styles.payLine, {height: 70}]}>
              <Image source={Images.cashier.PayCard} style={[styles.payLineIconCard, {marginTop: -9}]}/>
              <View style={styles.payContent}>
                <Text style={styles.payText}>银行卡支付</Text>
                <View style={styles.payDesc}>
                  <Text style={styles.payDescText}>点击还款，即表示您同意</Text>
                  <Touchable onPress={() => {
                    this.props.navigation.navigate(Router.WEB, {
                      title: "扣款协议",
                      url: "http://47.99.0.78/html/withholdAgreement.html"
                    });
                  }}><Text style={[styles.payDescText, {color: "#EB4542"}]}>《代扣协议》</Text></Touchable>
                </View>
              </View>
              <Touchable style={styles.payLineRadio}>
                <Image style={{width: 18, height: 18}}
                       source={payMode === 'card' ? Images.cashier.payChoosed : Images.cashier.payChooseNull}/>
              </Touchable>
            </Touchable>
            <View style={styles.payTitle}>
              <Text style={styles.payTitleText}>快捷支付</Text>
            </View>
            {/*<Touchable
              onPress={() => {
                this.setState({
                  payMode: "wx"
                })
              }}
              style={[styles.payLine, styles.payLineBorder]}>
              <Image source={Images.cashier.PayWx} style={styles.payLineIconCard}/>
              <View style={styles.payContent}>
                <Text style={styles.payText}>微信支付</Text>
              </View>
              <Touchable style={styles.payLineRadio}>
                <Image style={{width: 18, height: 18}}
                       source={payMode === 'wx' ? Images.cashier.payChoosed : Images.cashier.payChooseNull}/>
              </Touchable>
            </Touchable>*/}

            <Touchable
              onPress={() => {
                this.setState({
                  payMode: "change"
                })
              }}
              style={[styles.payLine]}>
              <Image source={Images.cashier.PayChange} style={styles.payLineIconCard}/>
              <View style={styles.payContent}>
                <Text style={styles.payText}>银行卡转账</Text>
              </View>
              <Touchable style={styles.payLineRadio}>
                <Image style={{width: 18, height: 18}}
                       source={payMode === 'change' ? Images.cashier.payChoosed : Images.cashier.payChooseNull}/>
              </Touchable>
            </Touchable>
          </View>
        </View>
        {/*底部*/}
        <View style={styles.cashierFot}>
          <Button
            onPress={() => {
              switch (payMode) {
                case "card":
                  this.state.dialogCard = true;
                  break;
                case "wx":
                  this.state.dialogWx = true;
                  break;
                case "change":
                  this.state.dialogChange = true;
                  break;
              }
              this.setState(this.state);
            }}
            style={styles.cashierBtn}>确定还款</Button>
        </View>

        {/*弹框银行卡扣款*/}
        {dialogCard && <View style={styles.dialogCard}>
          <View style={styles.dialogMask}>

          </View>
          <View style={styles.dialogBox}>
            <View style={styles.dCardHeader}>
              <Touchable
                onPress={() => {
                  this.setState({
                    dialogCard: false
                  })
                }}
                style={styles.dCardClose}>
                <Image style={{width: 12, height: 12}} source={Images.cashier.Close}/>
              </Touchable>
              <Text style={styles.dCardHeaderText}>确认还款</Text>
            </View>
            <View style={styles.dCardBody}>
              <View style={styles.dCardMoney}>
                <Text style={styles.dCardMoneyText}>￥<Text
                  style={styles.dCardMoneyNum}>{money(repayMoney)}</Text></Text>
              </View>
              <View style={styles.dCardLine}>
                <Text style={styles.dCardLabel}>付款方式</Text>
                <Text style={styles.dCardValue}>{openBankName}({bankAccount4})</Text>
              </View>
            </View>
            <View style={styles.dCardFot}>
              <Button
                onPress={() => {
                  this.submit();
                }}
                style={styles.cashierBtn}>确定</Button>
            </View>
          </View>
        </View>}
        {/*弹框微信支付*/}
        <Alert
          title={'微信转账'}
          message={dialogWxBody}
          msgStyle={styles.dialogWxLayout}
          showCancelBtn={false}
          showConfirmBtn={true}
          confirmText={'确定'}
          onClose={() => {
            this.setState({
              dialogWx: false
            })
          }}
          onConfirm={() => {
            /*返回到首页*/
            // if (source === 'BILL') {
            //   this.props.navigation.goBack(Router.BILL);
            // } else {
            //   this.props.navigation.popToTop();
            // }

            const resetAction = StackActions.reset({
              index: 0,
              actions: [NavigationActions.navigate({routeName: Router.MAIN})],
            });
            this.props.navigation.dispatch(resetAction);

          }}
          visible={this.state.dialogWx}/>

        {/*弹框银行转账*/}
        <Alert
          title={'银行卡转账'}
          message={RenderDialogChange}
          msgStyle={styles.dialogChangeLayout}
          showCancelBtn={false}
          showConfirmBtn={true}
          confirmText={'下一步'}
          onClose={() => {
            this.setState({
              dialogChange: false
            })
          }}
          onConfirm={() => {
            /*返回到首页*/
            // if (source === 'BILL') {
            //   this.props.navigation.goBack(Router.BILL);
            // } else {
            //   this.props.navigation.popToTop();
            // }

            this.props.navigation.navigate(Router.UPLOADRES, {
              money: repayMoney,
              loanNo,
              payBody,
            });

            // const resetAction = StackActions.reset({
            //   index: 0,
            //   actions: [NavigationActions.navigate({routeName: Router.MAIN})],
            // });
            // this.props.navigation.dispatch(resetAction);

          }}
          visible={this.state.dialogChange}/>

      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#F4F5FA',
  },
  cashierBox: {
    flex: 1
  },
  topTips: {
    width,
    height: 26,
    backgroundColor: 'rgba(255, 135, 0, 0.0962)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  topTipsText: {
    color: '#FF604F',
    fontSize: 12,
    lineHeight: 17
  },
  /*账单选择*/
  repayBox: {
    width,
    paddingHorizontal: 15,
  },
  RepayItem: {
    marginTop: 10,
    borderRadius: 4,
    backgroundColor: "#FFF",
    paddingHorizontal: 14,
    paddingTop: 7,
    borderColor: "#FFF",
    borderWidth: 1
  },
  RepayBorder: {
    borderColor: "#FF8700"
  },
  reapyRadio: {
    width: 18,
    height: 18,
    marginRight: 10
  },
  RepayTitle: {
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#E6E6E6"
  },
  Repayh2: {
    flex: 1,
    fontSize: 16,
    color: "#1E1E1E"
  },
  RepayMoney: {
    color: '#FF604F',
    fontSize: 24
  },
  RepayContent: {
    paddingVertical: 10,
  },
  repayDesc: {
    fontSize: 12,
    lineHeight: 17,
    color: "#A2A2A2"
  },
  /*付款方式*/
  payBox: {},
  payTitle: {
    height: 33,
    paddingLeft: 15,
    justifyContent: "center"
  },
  payTitleText: {
    fontSize: 12,
    color: "#808080"
  },
  payLine: {
    height: 50,
    backgroundColor: "#FFF",
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: 'center'
  },
  payLineBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#E9E9E9"
  },
  payLineIconCard: {
    width: 32,
    height: 32,
    marginRight: 10
  },
  payContent: {
    flex: 1
  },
  payText: {
    fontSize: 15,
    color: "#1E1E1E"
  },
  payDesc: {
    flexDirection: "row"
  },
  payDescText: {
    fontSize: 12,
    color: "#A2A2A2",
  },
  payLineRadio: {
    width: 18
  },

  /*吸底按钮*/
  cashierFot: {
    width,
    height: 50,
  },
  cashierBtn: {
    width,
    height: 50,
    borderRadius: 0
  },

//  银行扣款弹框
  dialogCard: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    width,
    height,
    backgroundColor: 'rgba(0,0,0,0.4)'
  },
  dialogBox: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    flex: 1,
    height: 271,
    flexDirection: 'column',
    backgroundColor: "#FFF"
  },
  dCardHeader: {
    height: 54,
    width,
    flexDirection: 'row',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#E9E9E9",
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  dCardClose: {
    position: 'absolute',
    left: 15,
    width: 12,
    height: 12
  },
  dCardHeaderText: {
    fontSize: 18,
    color: "#1E1E1E"
  },
  dCardBody: {
    flex: 1,
    flexDirection: 'column',
    paddingHorizontal: 15
  },
  dCardMoney: {
    height: 75,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: "#E9E9E9",
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  dCardMoneyText: {
    fontSize: 15,
    color: "#4A4B5B"
  },
  dCardMoneyNum: {
    fontSize: 24,
    color: "#4A4B5B"
  },
  dCardLine: {
    height: 49,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderColor: "#E9E9E9",
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  dCardLabel: {
    fontSize: 15,
    color: "#1E1E1E"
  },
  dCardValue: {
    fontSize: 15,
    color: "#808080"
  },
  dCardFot: {
    height: 48
  },
  //
  dialogWxLayout: {
    height: 378,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: "#E9E9E9"
  },
  dialogWxBody: {
    flexDirection: 'column',
    paddingHorizontal: 44,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },

  //银行转账
  dialogChangeLayout: {
    height: 378,
    width: 315,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: "#E9E9E9",
    paddingBottom: 0
  },
  dialogChangeBody: {
    width: 315,
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20
  },
  dChangeLine: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#E9E9E9"
  },
  dChangeLabel: {
    width: 65,
    marginRight: 10,
    fontSize: 15,
    lineHeight: 21,
    color: "#1E1E1E"
  },
  dChangeValue: {
    fontSize: 15,
    color: "#808080"
  },
  dChangeFot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
});
