import React, {Component} from 'react';
import {SafeAreaView} from 'react-navigation';
import {Platform, StyleSheet, ScrollView, Image, TextInput, Text, View} from 'react-native';
import connect from "react-redux/es/connect/connect";
import Picker from 'react-native-picker';
import {Toast} from "../../utils";
import {width, height} from "../../utils/screen";
import {Button, Touchable} from "../../components";
import {Images} from "../../common/images";

type Props = {};
@connect(({app, loading, NSBank}) => ({app, loading, NSBank}))
export default class BankNew extends Component<Props> {

  static navigationOptions = (navigation) => {
    console.log(navigation);
    return {
      title: "绑定银行卡"
    }
  };

  constructor(props) {
    super(props);
    this.TimeOutCount = null;
    this.state = {
      codeList: [],
      openBankCodeName: "请选择",
      bankAccount: "",
      openBankCode: "",
      ownerMobile: this.props.app.user.clientCell,
      ownerName: this.props.app.user.clientName,
      validCode: "",
      countdown: 60,
      canSendCode: true,
      verifyTxt: '获取验证码'
    }
  }

  componentDidMount() {

  }

  hidePicker() {
    if (Picker.isPickerShow()) {
      Picker.hide();
    }
  }

  showBankList() {
    const {dispatch} = this.props;
    /*借款详情*/
    dispatch({
      type: 'NSBank/eff_card_list',
      payload: {},
      callback: (data) => {
        this.setState({
          codeList: data
        });

        const PickerData = [];
        let defaultData = '';
        const code = this.state.openBankCode;
        data.filter((item) => {
          if (item.code === code) {
            defaultData = item.message;
          }
          PickerData.push(item.message);
        });

        Picker.init({
          pickerData: PickerData,
          selectedValue: [defaultData],
          pickerBg: [255, 255, 255, 1],
          pickerCancelBtnColor: [204, 204, 204, 1],
          pickerConfirmBtnText: '确定',
          pickerCancelBtnText: "取消",
          pickerTitleText: '借款用途',
          onPickerConfirm: res => {

            /*赋值*/
            data.forEach((item) => {
              if (item.message === res[0]) {
                this.setState({
                  openBankCodeName: item.message,
                  openBankCode: item.code
                })
              }
            });


            this.hidePicker();
          },
          onPickerCancel: () => {
            this.hidePicker();
          }
        });
        Picker.show();

      }
    });

  }

  ValidMobile(val) {
    return (/^1[34578]\d{9}$/.test(val));
  }

  checkInfo() {
    const {bankAccount, openBankCode, ownerMobile, ownerName} = this.state;

    console.log(this.state);
    if (!ownerName) {
      Toast.show('请输入持卡人姓名');
      return false;
    }

    if (!openBankCode) {
      Toast.show('请选择开户银行');
      return false;
    }

    if (!bankAccount) {
      Toast.show('请输入银行卡号');
      return false;
    }
    if (bankAccount.length < 16 || bankAccount.length > 19) {
      Toast.show('请输入正确的银行卡号');
      return false;
    }

    if (!ownerMobile) {
      Toast.show('请输入银行预留手机号码');
      return false;
    }
    if (!this.ValidMobile(ownerMobile)) {
      Toast.show('请输入正确的手机号码');
      return false;
    }

    return true;
  }


  /*获取验证码*/
  GetVerifyCode() {
    const {bankAccount, openBankCodeName, openBankCode, ownerMobile, ownerName} = this.state;
    if (this.checkInfo()) {
      const {dispatch} = this.props;
      dispatch({
        type: 'NSBank/eff_bank_send',
        payload: {
          bankAccount,
          openBankCode,
          ownerMobile,
          ownerName,
        },
        callback: (res) => {
          console.log(res.result);
          if (res.success) {
            Toast.show('验证码发送成功，请注意查收');
            this.countdown();
          }
        }
      });
    }
  }

  /*倒计时*/
  countdown() {
    let {countdown} = this.state;
    if (this.state.countdown === 1) {
      this.setState({
        verifyTxt: "获取验证码",
        canSendCode: true,
        countdown: 60,
      });
      return false;
    } else {
      this.setState({
        countdown: --countdown,
        canSendCode: false,
        verifyTxt: `${countdown}秒`
      })
    }
    if (this.TimeOutCount != null) clearTimeout(this.TimeOutCount);
    this.TimeOutCount = setTimeout(() => {
      this.countdown();
    }, 1000);
  }

  initBank(callback) {
    const {dispatch} = this.props;
    dispatch({
      type: "NSBank/eff_bank_info",
      payload: {},
      callback: callback
    })
  }

  /*银行卡签约*/
  bankSignIn() {
    if (this.checkInfo()) {
      const {bankAccount, openBankCode, ownerMobile, ownerName, validCode} = this.state;
      const {dispatch} = this.props;

      dispatch({
        type: 'NSBank/eff_bank_sign',
        payload: {
          bankAccount,
          openBankCode,
          ownerMobile,
          ownerName,
          validCode
        },
        callback: (res) => {
          if (res.success) {
            Toast.show('绑卡成功');
            this.initBank(() => {
              this.props.navigation.goBack(null);
            });

            // setTimeout(() => {
            //   Toast.hide();
            //   this.props.navigation.state.params.onGoBack();
            // }, 2000)

          } else {
            Toast.show('绑卡失败');
          }
        }
      });
    }
  }

  componentWillUnmount() {
    this.TimeOutCount != null && clearTimeout(this.TimeOutCount);
  }

  render() {
    const {openBankCodeName, validCode, bankAccount, canSendCode, ownerName, ownerMobile, verifyTxt} = this.state;

    let RenderOpenBankName;
    if (openBankCodeName === '请选择') {
      RenderOpenBankName = <Text style={{color: "#bbb"}}>{openBankCodeName}</Text>
    } else {
      RenderOpenBankName = <Text style={{color: "#808080"}}>{openBankCodeName}</Text>
    }

    return (
      <SafeAreaView style={styles.container}>
        <ScrollView
          keyboardDismissMode={'on-drag'}
          keyboardShouldPersistTaps={'handled'}
          style={styles.form}>
          <View style={styles.formItem}>
            <View style={styles.formItemInner}>
              <View style={styles.label}>
                <Text style={styles.labelText}>持卡人</Text>
              </View>
              <View style={styles.content}>
                <Text style={styles.contentText}>{ownerName}</Text>
              </View>
            </View>
          </View>

          <View style={styles.formItem}>
            <View style={styles.formItemInner}>
              <View style={styles.label}>
                <Text style={styles.labelText}>开户银行</Text>
              </View>
              <Touchable
                onPress={() => {
                  this.showBankList();
                }}
                style={[styles.content, styles.contentCardList]}>
                <Text style={[styles.contentText, {flex: 1}]}>
                  {RenderOpenBankName}
                </Text>
                <Image
                  resizeMode={'contain'}
                  style={styles.contentArrow}
                  source={Images.common.ArrowRight}/>
              </Touchable>
            </View>
          </View>

          <View style={[styles.formItem, styles.formItemMarginBottom]}>
            <View style={[styles.formItemInner, styles.formItemInnerNoBorder]}>
              <View style={styles.label}>
                <Text style={styles.labelText}>银行卡号</Text>
              </View>
              <View style={styles.content}>
                <TextInput
                  value={bankAccount}
                  onChangeText={(val) => {
                    this.setState({
                      bankAccount: val
                    })
                  }}
                  maxLength={19}
                  placeholderTextColor={'#bbb'}
                  style={styles.inputMobile}
                  clearButtonMode={'always'}
                  keyboardType={'numeric'}
                  underlineColorAndroid="transparent"
                  placeholder='请输入银行卡号'
                />

              </View>
            </View>
          </View>

          <View style={[styles.formItem, styles.formItemMarginBottom]}>
            <View style={[styles.formItemInner, styles.formItemInnerNoBorder]}>
              <View style={styles.label}>
                <Text style={styles.labelText}>预留手机号</Text>
              </View>
              <View style={styles.content}>
                <TextInput
                  defaultValue={ownerMobile}
                  onChangeText={(val) => {
                    this.setState({
                      ownerMobile: val
                    })
                  }}
                  clearButtonMode={'always'}
                  style={styles.inputMobile}
                  placeholderTextColor={'#bbb'}
                  maxLength={11}
                  underlineColorAndroid="transparent"
                  keyboardType={'numeric'}
                  placeholder="请输入预留手机号码"/>
              </View>
            </View>
          </View>


          <View style={styles.formItem}>
            <View style={styles.formItemInner}>
              <View style={styles.label}>
                <Text style={styles.labelText}>验证码</Text>
              </View>
              <View style={styles.content}>
                <TextInput
                  defaultValue={validCode}
                  onChangeText={(val) => {
                    this.setState({
                      validCode: val
                    })
                  }}
                  clearButtonMode={'always'}
                  style={styles.inputVerify}
                  maxLength={6}
                  placeholderTextColor={'#bbb'}
                  underlineColorAndroid="transparent"
                  keyboardType={'numeric'}
                  placeholder="请输入验证码"/>

                <Touchable
                  onPress={() => {
                    canSendCode && this.GetVerifyCode();
                  }}
                  style={styles.btnVerify}>
                  <Text style={styles.btnVerifyText}>{verifyTxt}</Text>
                </Touchable>

              </View>
            </View>
          </View>


        </ScrollView>

        {/*提交按钮*/}
        <Button
          onPress={() => {
            this.bankSignIn();
          }} style={styles.btn}>完成</Button>

        {/*选择器*/}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F5FA',
  },
  form: {
    flex: 1
  },

  formItem: {
    paddingHorizontal: 15,
    backgroundColor: "#fff"
  },
  formItemMarginBottom: {
    marginBottom: 10
  },

  formItemInner: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: "#E9E9E9",
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  formItemInnerNoBorder: {
    borderBottomWidth: 0
  },
  label: {
    width: 90,
    alignItems: "flex-start"
  },
  labelText: {
    color: '#1E1E1E',
    fontSize: 15
  },
  content: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row'
  },
  contentCardList: {
    justifyContent: 'space-between'
  },
  contentArrow: {},
  contentText: {
    fontSize: 15,
    color: "#1E1E1E"
  },
  inputMobile: {
    padding: 0,
    height: 40,
    color: '#808080'
  },
  /*验证码*/
  inputVerify: {
    flex: 1,
    padding: 0,
    height: 40,
    color: '#808080'
  },
  btnVerify: {
    width: 90,
    height: 30,
    borderRadius: 4,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#EB4542",
    alignItems: 'center',
    justifyContent: 'center'
  },
  btnVerifyText: {
    fontSize: 15,
    color: "#EB4542"
  },


  /*底部按钮*/
  btn: {
    borderRadius: 0,
    width,
    height: 48
  }
});
