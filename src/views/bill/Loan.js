import React, {Component} from 'react';
import {StackActions, NavigationActions, SafeAreaView, NavigationEvents} from 'react-navigation';
import {Platform, ScrollView, StyleSheet, Image, Text, TextInput, View} from 'react-native';
import connect from "react-redux/es/connect/connect";
import Picker from 'react-native-picker';
import {Button, Line, Touchable, Dialog, Plan} from "../../components";
import Router from "../../Router";
import {width} from "../../utils/screen";
import {money, Toast} from "../../utils";
import {Images} from "../../common/images";
import moment from "moment";

/*借款金额*/
let LoanAmtData = [3000, 4500, 6000, 7500];

type Props = {};
@connect(({app, loading, NSLoan, NSBank}) => ({app, loading, NSLoan, NSBank}))
export default class Loan extends Component<Props> {
  static navigationOptions = (navigation) => {
    console.log(navigation);
    return {
      title: "借款"
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      loanAmt: "请选择借款额度",
      loanLimit: 6,
      loanLife: 15,
      loanUnit: "DAY",
      loanUsage: "",
      visible: false,
      bindCard: false,
      loan: {},
      feeAmt: 0,
      raiseAmt: 0,

      modalFee: false,

      modalPlan: false,

      feeInfo: {},
      planInfo: []
    }
  }

  componentDidMount() {
    const {topAmt} = this.props.app.user;
    this.setState({
      loanAmt:topAmt
    });

    this.init(topAmt);
  }

  init(amt) {
    /*初始化银行卡信息*/
    this.initBankInfo();
    /*初始化可借额度列表*/
    this.initLoanLimit();
    /*初始化借款协议*/
    this.initLoanAgreement();

    /*计算服务费*/
    this.updateLoanFee(amt)
  }


  /*初始化可借额度列表,列表修改，更新相关服务费的信息*/
  initLoanAgreement() {
    const {dispatch} = this.props;
    /*借款详情*/
    dispatch({
      type: 'NSLoan/loan_agreement',
      payload: {},
      callback: (data) => {
        this.setState({
          loanLimitData: data
        });
      }
    });
  }

  /*初始化可借额度列表,列表修改，更新相关服务费的信息*/
  initLoanLimit() {
    const {dispatch} = this.props;
    /*借款详情*/
    dispatch({
      type: 'NSLoan/loan_limit',
      payload: {},
      callback: (data) => {
        this.setState({
          loanLimitData: data
        });
      }
    });
  }

  hidePicker() {
    if (Picker.isPickerShow()) {
      Picker.hide();
    }
  }

  /*展开可借额度列表*/
  showLoanLimit() {
    const data = this.props.NSLoan.loanLimit;
    let defaultData = data[0];

    Picker.init({
      pickerData: data,
      selectedValue: [defaultData],
      pickerBg: [255, 255, 255, 1],
      pickerCancelBtnColor: [204, 204, 204, 1],
      pickerConfirmBtnText: '确定',
      pickerCancelBtnText: "取消",
      pickerTitleText: '可借额度',
      onPickerConfirm: res => {

        /*赋值*/

        console.log(res, '选中的额度内容');

        /*借款额度*/
        this.setState({
          loanAmt: res[0]
        });

        /*计算服务费*/
        this.updateLoanFee(res[0]);


        this.hidePicker();
      },
      onPickerCancel: () => {
        this.hidePicker();
      }
    });
    Picker.show();

  }

  initBankInfo() {
    const {dispatch} = this.props;
    dispatch({
      type: "NSBank/eff_bank_info",
      payload: {},
      callback: (res) => {
        if (res.result != null) {
          this.setState({
            bindCard: true
          })
        }
        console.log(res, '银行卡信息');
      }
    })
  }

  /*计算服务费*/
  updateLoanFee(loanAmt, callback) {
    const {dispatch} = this.props;
    /*借款详情*/
    dispatch({
      type: 'NSLoan/loan_fee',
      payload: {
        loanAmt
      },
      callback: (res) => {
        const {rateAmt} = res;

        this.setState({
          loan: res,
          feeAmt: rateAmt
        });

        //  回调
        callback && callback();
      }
    });
  }

  /*借款提交*/
  submit() {
    const {loanAmt, bindCard} = this.state;

    if (!loanAmt) {
      Toast.show('借款金额不能为空');
      return false;
    }

    if (loanAmt % 100 !== 0) {
      Toast.show('借款金额必须是100的整数倍');
      return false;
    }

    if (loanAmt < 1000) {
      Toast.show('借款金额不能少于1000');
      return false;
    }

    if (!bindCard) {
      Toast.show('请先绑定银行卡');
      return false;
    }

    // this.updateLoanFee(this.state.loanAmt, () => {
    //   this.setState({
    //     visible: true
    //   })
    // });

    this.submitConfirm();
  }

  submitConfirm() {
    const {loanAmt} = this.state;
    const {dispatch} = this.props;
    dispatch({
      type: 'NSLoan/loan_create',
      payload: {
        loanAmt
      },
      callback: (res) => {
        if (res.success) {
          this.props.navigation.replace(Router.LOAN_RESULT);
        } else {
          Toast.show('借款失败，请刷新页面重试');
        }
      }
    });
  }

  render() {
    const {feeAmt, loanAmt, loan} = this.state;
    const user = this.props.app.user;
    const remainAmt = user.topAmt;
    const bankInfo = this.props.app.bank;

    let RenderBankLine;
    if (bankInfo !== null) {
      const {openBankName, bankAccount4} = bankInfo;
      if (openBankName) {
        RenderBankLine = <Line
          text='收款银行卡'
          extra={`${openBankName}(${bankAccount4})`}
          style={[styles.loanLine]}
        />
      }
    } else {
      RenderBankLine = <Line
        arrow={true}
        text='收款银行卡'
        extra={'未绑定'}
        style={[styles.loanLine]}
        onPress={() => {
          this.props.navigation.navigate(Router.BANKNEW);
        }}
      />
    }

    /*初始化可借信息*/
    let loanAmtTxt = "";
    // if (remainAmt > 1000) {
    //   loanAmtTxt = `可借范围1000 ~ ${remainAmt}元`;
    // } else {
    //   loanAmtTxt = `可借金额1000元`;
    // }

    /*借款金额*/
    const LoanAmt = loanAmt ? loanAmt : remainAmt;

    return (
      <SafeAreaView style={styles.container}>
        <NavigationEvents
          onDidFocus={() => {
            // this.init();
          }}
        />

        {/*内容部分*/}
        <ScrollView
          keyboardDismissMode={'on-drag'}
          keyboardShouldPersistTaps={'handled'}
          style={styles.contentContainer}>
          {/*头部*/}
          <View style={styles.loanHeader}>
            {/*背景图*/}
            <Image
              style={styles.loanHeaderBg}
              source={Images.bill.LoanBg}
              resizeMode={'stretch'}/>
            <View style={styles.loanTitle}>
              <Text style={styles.loanTitleText}>借款金额(元)</Text>
              <View style={styles.loanInput}>
                <Text style={styles.loanIcon}>￥</Text>
                <Touchable
                  style={styles.loanInputBox}
                  onPress={() => {
                    this.showLoanLimit();
                  }}>
                  <Text
                    style={[{fontSize: 30}, loanAmt !== '请选择借款额度' ? {color: "#FFF"} : {color: "rgba(255,255,255,0.6)"}]}>{loanAmt}</Text>
                </Touchable>
                {/*    <TextInput
                  style={styles.loanInputBox}
                  value={this.state.loanAmt + ''}
                  maxLength={4}
                  placeholder={'请输入100的整数'}
                  keyboardType={'numeric'}
                  underlineColorAndroid={"transparent"}
                  clearTextOnFocus={true}
                  blurOnSubmit={true}

                  placeholderTextColor={'rgba(255,255,255,0.6)'}
                  onEndEditing={() => {
                    if (loanAmt && loanAmt > 0) {
                      this.updateLoanFee(this.state.loanAmt);
                    } else {
                      this.updateLoanFee(0);
                    }
                  }}
                  onChangeText={(text) => {
                    this.setState({
                      loanAmt: text
                    })
                  }}>
                </TextInput>*/}
              </View>
              <View style={styles.loanRange}>
                <Text style={styles.loanRangeText}>{loanAmtTxt}</Text>
              </View>
            </View>
            {/*介绍*/}
            <View style={styles.loanInfo}>
              <View style={styles.loanInfoItem}>
                <Text style={styles.loanInfoLabel}>借款天数</Text>
                <Text style={styles.loanInfoValue}>{this.props.app.user.life}天</Text>
              </View>
              <View style={styles.loanInfoLine}>

              </View>
              <View style={styles.loanInfoItem}>
                <Text style={styles.loanInfoLabel}>利息(元)</Text>
                <Text style={styles.loanInfoValue}>{money(feeAmt)}</Text>
              </View>
            </View>
          </View>
          {/*选项*/}
          <View style={styles.loanChoose}>

            <Line
              text='到账金额'
              border={true}
              extra={`${money(loan.raiseAmt)}元`}
              style={styles.loanLine}
            />

            <Line
              text='服务费'
              border={true}
              extra={`${money(loan.serviceAmt)}元`}
              style={styles.loanLine}
            />

            <Line
              text='到期应还'
              border={false}
              extra={`${money(loan.loanAmt)}元`}
              style={[styles.loanLine, {marginBottom: 10}]}
            />

            <Line
              text='消费用途'
              border={true}
              extra={`个人日常消费`}
              style={styles.loanLine}
            />

            {/*银行卡信息*/}
            {RenderBankLine}

            {/*其他文字说明*/}
            <View style={styles.loanFooter}>
              <View style={styles.loanFooterTitle}>
                <Text style={styles.loanFooterTitleText}>提交申请即代表您同意</Text>
                <Touchable
                  onPress={() => {
                    this.props.navigation.navigate(Router.WEB, {
                      title: "借款协议",
                      url: "http://47.99.0.78/html/loanAgreement.html"
                    })
                  }}>
                  <Text style={styles.loanFooterAgreement}>《借款协议》</Text>
                </Touchable>
              </View>
           {/*   <Text style={styles.loanFooterDesc}>
                提现金额会在24小时内发放，请注意查收
              </Text>*/}
            </View>
          </View>
        </ScrollView>

        {/*底部按钮*/}
        <View style={styles.loanBtnBox}>
          <Button
            onPress={() => {
              /*跳转到借款结果页面*/
              this.submit();

            }}
            style={styles.loanBtn}>提交</Button>
        </View>

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
            this.submitConfirm();
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
            <Text style={styles.text6}>注：<Text>最终借款日期以系统放款日为准</Text></Text>
          </View>
        </Dialog>}

      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
    container: {
      flex: 1
    },
    contentContainer: {
      flex: 1,
      backgroundColor: "#F4F5FA"
    },
    loanHeader: {
      position: 'relative',
      height: 253,
      backgroundColor: "#FFF",
      marginBottom: 20,
      paddingTop: 146
    },
    loanHeaderBg: {
      position: 'absolute',
      left: 0,
      top: 0,
      zIndex: 500,
      width,
      height: 146
    },
    loanTitle: {
      position: 'absolute',
      left: 0,
      top: 0,
      zIndex: 1000,
      width,
      height: 146,
      paddingTop: 20,
      paddingLeft: 15
    },
    loanTitleText: {
      fontSize: 16,
      height: 22,
      color: "#FFF",
      lineHeight: 22,
      marginBottom: 10
    },
    loanInput: {
      flexDirection: 'row',
      alignItems: 'center',
      height: 50,
      borderBottomColor: "#FFF",
      borderBottomWidth: StyleSheet.hairlineWidth
    },
    loanIcon: {
      fontSize: 36,
      color: "#fff",
      lineHeight: 50
    },
    loanInputBox: {
      height: 50,
      flex: 1,
      marginLeft: 5,
      fontSize: 30,
      padding: 0,
      color: "#FFF",
      flexDirection: 'row',
      alignItems: 'center',
    },
    loanRange: {
      height: 35,
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
      paddingRight: 15,
    },
    loanRangeText: {
      textAlign: "right",
      fontSize: 12,
      lineHeight: 17,
      color: 'rgba(255, 255, 255, 0.7)'
    },
    loanInfo: {
      height: 107,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center'
    }
    ,
    loanInfoLine: {
      width: 1,
      height: 42,
      backgroundColor: "#E9E9E9"
    }
    ,
    loanInfoItem: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    }
    ,
    loanInfoLabel: {
      fontSize: 12,
      color: "#808080",
      lineHeight: 17,
      marginBottom: 8
    },
    loanInfoValue: {
      fontSize: 30,
      color: "#4A4B5B",
      lineHeight: 42
    },
    lineFeeIcon: {
      position: 'absolute',
      left: 55,
      top: 3,
      width: 14,
      height: 14
    },
    lineFeeIconImg: {
      width: 14,
      height: 14
    },
    /*借款的选项*/
    loanChoose: {
      flex: 1,
      flexDirection: 'column'
    },
    loanLine: {
      height: 50
    },
    loanFooter: {
      flex: 1,
      marginTop: 120,
      paddingBottom: 24,
      flexDirection: 'column',
      justifyContent: 'flex-end',
      alignItems: 'center'
    },
    loanFooterTitle: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center'
    },
    loanFooterTitleText: {
      fontSize: 12,
      lineHeight: 17,
      color: "#808080",
      marginBottom: 2
    },
    loanFooterAgreement: {
      color: "#FF604F",
      fontSize: 12,
      lineHeight: 17,
    },
    loanFooterDesc: {
      fontSize: 12,
      lineHeight: 17,
      color: "#BBB"
    },
    /*底部按钮*/
    loanBtnBox: {
      width,
      height: 50
    },
    loanBtn: {
      width: '100%',
      height: 50,
      borderRadius: 0
    },


    /*弹框样式*/
    body: {
      paddingHorizontal: 20,
      paddingVertical: 15
    },
    text1: {
      lineHeight: 26,
      fontSize: 15,
      color: "#4A4B5B",
      marginBottom: 10,
      textAlign: 'justify'
    },
    text2: {
      fontSize: 15,
      lineHeight: 26,
      color: "#FF8700",
      marginBottom: 10
    },
    text3: {
      fontSize: 15,
      lineHeight: 26,
      color: "#4A4B5B"
    },
    text4: {
      marginTop: 15
    },
    text5: {
      fontSize: 15,
      lineHeight: 26,
      color: "#808080"
    },
    text6: {
      color: '#FF8700',
      fontSize: 12,
      lineHeight: 17,
      marginTop: 10
    },
    borders: {
      fontWeight: 'bold'
    }
  })
;
