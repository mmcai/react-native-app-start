import React, {Component} from 'react';
import {SafeAreaView, NavigationEvents} from 'react-navigation'
import {Platform, RefreshControl, StyleSheet, ScrollView, Image, Text, View, Linking} from 'react-native';
import Button from "../../components/Button";
import {width, height} from "../../utils/screen";
import {money, Toast} from "../../utils";
import {Alert, Line, LinearButton, Touchable} from "../../components";
import Router from "../../Router";
import connect from "react-redux/es/connect/connect";
import moment from 'moment';
import _ from 'lodash';
import {Images} from "../../common/images";
import {Dialog} from "../../components";

type Props = {};
@connect(({app, loading, NSIndex, NSLoan}) => ({app, loading, NSIndex, NSLoan}))
export default class Home extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      loanNo: null,
      modal: false,
      loaded: false,
      visibleCell: false,
      visible: false,
      remainAmt: null,
      overdueDays: 0,
      overdueAmt: 0,
      refreshing: false
    }
  }

  componentDidMount() {
    // this.init();
  }


  init(callback) {
    const {dispatch} = this.props;
    /*借款详情*/
    dispatch({
      type: 'NSLoan/loan_info',
      payload: {},
      callback: (res) => {
        console.log(res, '借款信息');
        if (res.success) {
          if (res.result !== null) {
            const {status, loanNo} = res.result;
            this.setState({
              loanNo
            });
            if (status === 'OVERDUED') {
              dispatch({
                type: "NSIndex/init_overdue_info",
                payload: {
                  loanNo
                },
                callback: (res) => {
                  if (res.success) {
                    const result = res.result;
                    const {remainAmt, overdueDays, overdueAmt} = result;
                    this.state.remainAmt = remainAmt;
                    this.state.overdueDays = overdueDays;
                    this.state.overdueAmt = overdueAmt;
                    this.setState(this.state);
                  }
                }
              })
            }
          }
        }
        Toast.hide();
        callback && callback();
      }
    });
  }

  _onRefresh = () => {
    this.setState({refreshing: true});
    this.init(() => {
      this.setState({refreshing: false});
    })
  };

  render() {
    const loan = this.props.NSIndex.loan;
    const {remainAmt = 0, overdueAmt = 0, overdueDays = 0} = this.props.NSIndex.overdue;
    const {user, ServiceCell} = this.props.app;


    let RenderBill = <ScrollView
      refreshControl={
        <RefreshControl
          refreshing={this.state.refreshing}
          onRefresh={this._onRefresh}
        />
      }
      style={styles.contentContainer}>
      <View style={styles.billNull}>
        <View style={styles.nullBody}>
          <Image style={styles.nullImg} resizeMode={'contain'} source={Images.bill.null}/>
          <Text style={styles.nullText}>您还没有借款</Text>
        </View>
      </View>
    </ScrollView>;

    if (!_.isEmpty(loan) && loan != null) {
      /*有内容的账单*/
      const {
        endDate,
        leftDays,
        loanAmt,
        loanLife,
        startDate,
        loanNo,
        status
      } = loan;


      switch (status) {
        case "INIT":
        case "SUBMITED":
        case "RAISECONFIRM":
          RenderBill = <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this._onRefresh}
              />
            }
            style={styles.contentContainer}>
            <View style={styles.billNull}>
              <View style={styles.nullBody}>
                <Image style={[styles.nullImg, {width: 315, height: 218, marginVertical: 30}]}
                       resizeMode={'contain'}
                       source={Images.bill.LoanIng}/>
                <Text style={styles.nullText}>系统打款中，请稍后... </Text>
                <Text style={styles.nullText}>预计在30分钟内到账，以银行实际到账为准</Text>
                <View style={{flex: 1, paddingBottom: 5, alignItems: 'center', justifyContent: 'flex-end'}}>
                  <Text style={styles.nullTextFooter}>注：9:00~18:00以外时间段，放款时间有延迟</Text>
                </View>
              </View>
            </View>
          </ScrollView>;
          break;
        case "OVERDUED":
          RenderBill = <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this._onRefresh}
              />
            }
            style={styles.contentContainer}>
            <View style={styles.billPanel}>
              <View style={styles.billHeader}>
                <View style={styles.billTitle}>
                  <Text style={styles.billTitleText}>待还款金额(元)</Text>
                  <Text style={[styles.billTitleAmount, {color: '#FF604F'}]}>{money(overdueAmt)}</Text>
                </View>

                <View style={styles.billInfo}>
                  <View style={[styles.billInfoItem, styles.billInfoItemFirst]}>
                    <Text style={styles.billInfoItemLabel}>逾期天数</Text>
                    <Text style={[styles.billInfoItemValue, {color: '#FF604F'}]}>{overdueDays}天</Text>
                  </View>
                  <View style={styles.billLineBg}></View>
                  <View style={[styles.billInfoItem, styles.billInfoItemLast]}>
                    <Text style={styles.billInfoItemLabel}>逾期罚息(元)</Text>
                    <Text style={[styles.billInfoItemValue, {color: '#FF604F'}]}>{money(remainAmt)}</Text>
                  </View>
                </View>
                <View style={styles.billBtnBox}>
                  <LinearButton
                    onPress={() => {
                      this.props.navigation.navigate(Router.CASHIER, {status: "OVERDUE", source: "BILL"});
                    }}
                    style={styles.billBtn}>
                    <Text>去还款</Text>
                  </LinearButton>
                </View>
              </View>
              {/*标题内容*/}
              <View style={styles.title}>
                <Text style={styles.titleText}>借款明细</Text>
              </View>
              {/*列表内容*/}
              <View style={styles.billPlanList}>
                <Line text={'放款日期'} extra={moment(startDate).format("YYYY.MM.DD")} border={true}/>
                <Line text={'还款周期'} extra={`${loanLife}天`} border={true}/>
                <Line text={'借款金额'} extra={`${money(loanAmt)}元`} border={true}/>
                <Line text={'逾期天数'} extra={`${overdueDays}天`}
                      extraStyle={{color: '#FF604F'}}
                      border={true}/>
                <Line text={'逾期罚息'} extra={`${money(remainAmt)}元`} extraStyle={{color: '#FF604F'}} border={true}/>
                <Line
                  text={'借款协议'}
                  onPress={() => {


                    this.props.navigation.navigate(Router.LOAN_ATTACH, {
                      loanNo: loanNo
                    });
                  }}
                  extraStyle={{color: "#4C7BFE"}}
                  extra={'查看'} style={{marginVertical: 10}} border={true}/>
              </View>
            </View>
          </ScrollView>;
          break;
        default:
          RenderBill = <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this._onRefresh}
              />
            }
            style={styles.contentContainer}>
            <View style={styles.billPanel}>
              <View style={styles.billHeader}>
                <View style={styles.billTitle}>
                  <Text style={styles.billTitleText}>待还款金额(元)</Text>
                  <Text style={styles.billTitleAmount}>{money(loanAmt)}</Text>
                </View>

                <View style={styles.billInfo}>
                  <View style={[styles.billInfoItem, styles.billInfoItemFirst]}>
                    <Text style={styles.billInfoItemLabel}>还款日期</Text>
                    <Text style={styles.billInfoItemValue}>{moment(endDate).format("YYYY.MM.DD")}</Text>
                  </View>
                  <View style={styles.billLineBg}>

                  </View>
                  <View style={[styles.billInfoItem, styles.billInfoItemLast]}>
                    <Text style={styles.billInfoItemLabel}>距离还款日</Text>
                    <Text style={[styles.billInfoItemValue]}>{leftDays}</Text>
                  </View>
                </View>
                <View style={styles.billBtnBox}>
                  {status === "REPAYCONFIRM" ? <Button style={styles.btnDisabled}>还款处理中,请稍候</Button> : <LinearButton
                    onPress={() => {
                      this.props.navigation.navigate(Router.CASHIER, {status: "LOAN", source: "BILL"});
                    }}
                    style={styles.billBtn}>
                    <Text>去还款</Text>
                  </LinearButton>}

                </View>
              </View>
              {/*标题内容*/}
              <View style={styles.title}>
                <Text style={styles.titleText}>借款明细</Text>
              </View>
              {/*列表内容*/}
              <View style={styles.billPlanList}>
                <Line text={'放款日期'} extra={moment(startDate).format("YYYY.MM.DD")} border={true}/>
                <Line text={'还款周期'} extra={`${loanLife}天`} border={true}/>
                <Line text={'借款金额'} extra={`${money(loanAmt)}元`} border={true}/>
                <Line text={'逾期天数'} extra={`${overdueDays}天`} border={true}/>
                <Line text={'逾期罚息'} extra={`${money(remainAmt)}元`} border={true}/>
                <Line text={'借款协议'} onPress={() => {
                  this.props.navigation.navigate(Router.LOAN_ATTACH, {
                    loanNo: loanNo
                  });
                }} extraStyle={{color: "#4C7BFE"}} extra={'查看'} style={{marginVertical: 10}} border={true}/>
              </View>
            </View>
          </ScrollView>;
          break;
      }

    }


    return (
      <SafeAreaView style={styles.container}>
        {/*订阅事件*/}
        <NavigationEvents
          onDidFocus={payload => {
            console.log("onDidFocus", payload, '账单');
            // this.init();
          }}
        />

        {/*页面内容*/}

        {/*账单内容*/}
        {RenderBill}


        {/*借条弹框*/}
        {this.state.visible && <Dialog
          title={'借条'}
          btnTxt={'确定'}
          onClose={() => {
            this.setState({
              visible: false
            })
          }}
          callback={() => {
            console.log("fuck");
          }}
        >
          <View style={styles.body}>
            <Text
              style={styles.text1}>今日由于个人财务紧张，从<Text style={styles.borders}>{loan.lendName}</Text>处借到<Text
              style={styles.borders}>{loan.backAmt}</Text>元，用于个人日常消费，借款期限<Text
              style={styles.borders}>{loan.loanLife}</Text>天，利息<Text
              style={styles.borders}>{loan.rateAmt}</Text>元，服务费<Text style={styles.borders}>{loan.serviceAmt}</Text>元，到期应还款合计<Text
              style={styles.borders}>{loan.loanAmt}</Text>元，人民币(大写)<Text style={styles.borders}>{loan.loanAmtCN}</Text>。</Text>
            <Text style={styles.text2}>如到期当日未还款，将按日收取逾期客户管理费。</Text>
            <Text style={styles.text3}>借款日期：<Text>{moment(loan.startDate).format("YYYY年MM月DD日")}</Text></Text>
            <Text style={styles.text3}>还款日期：<Text>{moment(loan.endDate).format("YYYY年MM月DD日")}</Text></Text>
            <Text style={[styles.text4, styles.text5]}>借款人：<Text>{user.clientName}</Text></Text>
            <Text style={styles.text5}>身份证：<Text>{user.certNo}</Text></Text>
            <Text style={styles.text5}> 日期：<Text>{moment(loan.startDate).format("YYYY年MM月DD日")}</Text></Text>
          </View>
        </Dialog>}

        {/*打电话弹框*/}
        <Alert
          title={'联系客服'}
          message={<Text>拨打电话<Text>{ServiceCell}</Text></Text>}
          showConfirmBtn={true}
          showCancelBtn={true}
          cancelText={'取消'}
          confirmText={'确定'}
          visible={this.state.visibleCell}
          onClose={() => {
            this.setState({
              visibleCell: false
            })
          }}
          onConfirm={() => {
            return Linking.openURL(`tel:${ServiceCell}`);
          }}
        />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F5FA"
  },
  contentContainer: {
    flex: 1,
    backgroundColor: "#FFF"
  },
  /*没有账单*/
  billNull: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: "#FFF",
  },
  nullBody: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
  },
  nullImg: {
    width: 216,
    height: 127,
    marginBottom: 35
  },
  nullText: {
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 26,
    color: "rgb(128,128,128)"
  },

  /*账单信息*/
  billPanel: {
    flex: 1,
    backgroundColor: "#F4F5FA"
  },
  billHeader: {
    width,
    height: 225,
    paddingHorizontal: 15,
    backgroundColor: "#FFF",
    paddingBottom: 15
  },
  billTitle: {
    height: 90,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  billTitleText: {
    fontSize: 16,
    lineHeight: 22,
    color: "#1E1E1E",
    marginBottom: 5
  },
  billTitleAmount: {
    fontSize: 24,
    lineHeight: 33,
    color: "#FF604F"
  },
  billInfo: {
    height: 75,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopColor: "#E9E9E9",
    borderTopWidth: StyleSheet.hairlineWidth
  },
  billInfoItem: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  billLineBg: {
    width: 1,
    height: 42,
    backgroundColor: "#E9E9E9"
  },
  billInfoItemLast: {
    alignItems: 'center',
  },
  billInfoItemFirst: {
    alignItems: 'center',
  },
  billInfoItemLabel: {
    marginBottom: 5,
    fontSize: 12,
    lineHeight: 17,
    color: "#808080"
  },
  billInfoItemValue: {
    fontSize: 16,
    lineHeight: 22,
    color: "#1E1E1E"
  },
  billInfoItemValueLast: {
    textAlign: 'right'
  },
  billBtnBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  billBtn: {
    width: 300,
    height: 44
  },

  /*还款列表*/
  billPlanList: {
    width
  },
  billPlanItem: {

    paddingVertical: 10,
    paddingBottom: 15,
    borderBottomColor: "#E9E9E9",
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  billPlanTitle: {
    height: 35,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  billIndex: {
    color: "#24BFF2",
    fontSize: 16,
    lineHeight: 22,
    marginRight: 15,
  },
  billTime: {
    flex: 1,
    color: "#808080",
    fontSize: 16,
    lineHeight: 22,
  },
  billStatus: {
    width: 80,
    height: 30,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  billStatusText: {
    fontSize: 16,
    lineHeight: 22,
    color: "#808080"
  },
  /*蓝色还款按钮*/
  pStatusBtn: {
    borderRadius: 15,
    alignItems: 'center',
    backgroundColor: "#24BFF2"
  },
  pStatusBtnText: {
    color: "#FFF"
  },

  /*红色文字*/
  pStatusOverdue: {
    alignItems: 'flex-end',
  },
  pStatusOverdueText: {
    color: "#F63F53"
  },

  /*红色按钮*/
  pStatusBtnOverdue: {
    borderRadius: 15,
    alignItems: 'center',
    backgroundColor: "#F63F53"
  },
  pStatusBtnOverdueText: {
    color: "#FFF"
  },

  billPlanInfo: {
    flex: 1,
  },
  billLine: {
    flex: 1,
    height: 28,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  billLabel: {
    width: 65,
    fontSize: 14,
    color: "#bbb",
    lineHeight: 22,
    textAlign: 'right'
  },
  billValue: {
    flex: 1,
    position: 'relative',
  },
  billValueText: {
    fontSize: 14,
    color: "#bbb",
    lineHeight: 22,
    textAlign: 'right'
  },


  title: {
    height: 30,
    paddingLeft: 15,
    justifyContent: 'center',
    backgroundColor: "#F8F8F9"
  },
  titleText: {
    fontSize: 12,
    lineHeight: 17,
    color: '#808080'
  },

  /*弹框样式*/
  body: {
    paddingHorizontal: 20,
    paddingTop: 15
  },
  text1: {
    lineHeight: 26,
    fontSize: 15,
    color: "#4A4B5B",
    marginBottom: 20,
    textAlign: 'justify'
  },
  text2: {
    fontSize: 15,
    lineHeight: 26,
    color: "#FF8700",
    marginBottom: 15
  },
  text3: {
    fontSize: 15,
    lineHeight: 26,
    color: "#4A4B5B"
  },
  text4: {
    marginTop: 20
  },
  text5: {
    fontSize: 15,
    lineHeight: 26,
    color: "#808080"
  },
  borders: {
    fontWeight: 'bold'
  },

  nullTextFooter: {
    marginTop: 180,
    fontSize: 13,
    lineHeight: 18,
    color: "#A2A2A2"
  },

  btnDisabled: {
    height: 44,
    borderRadius: 4,
    backgroundColor: "#D0D4DB",
    color: "#FFFFFF"
  },
});
