import React, {Component} from 'react';
import {SafeAreaView, StackActions, NavigationActions} from 'react-navigation';
import {Platform, ScrollView, StyleSheet, TextInput, Image, Text, View} from 'react-native';
import connect from "react-redux/es/connect/connect";
import {Images} from "../../common/images";
import Button from "../../components/LinearButton";
import {width} from "../../utils/screen";
import {Toast, Storage} from "../../utils";
import {Touchable, CheckBox} from "../../components";
import Router from "../../Router";
import Timer from 'react-timer-mixin';
import {onEvent,onEventWithLable,onPageStart,onPageEnd} from '../../utils/umt';
type Props = {};
@connect(({app, loading, NSLogin, NSAuthName}) => ({app, loading, NSLogin, NSAuthName}))

export default class Login extends Component<Props> {
  static mixins = [Timer];
  static  navigationOptions = () => {
    return {
      title: "登录"
    }
  };

  constructor(props) {
    super(props);
    this.TimeOutCount = null;
    this.state = {
      mobile: '',
      clear: false,
      verifyCode: '',
      canSendCode: true,
      checked: true,
      verifyTxt: "点击获取验证码",
      countdown: 60
    };
    this.GetLocalPhone();
  }

  async GetLocalPhone() {
    const phone = await Storage.getValue('phone');
    if (phone != null) {
      this.setState({
        mobile: phone
      })
    }
  }

  componentDidMount() {
    console.log(this.props);

    onEvent('regist');
    onEventWithLable('regist', '注册登录成功');
  }

  GetVerifyCode() {
    const {mobile} = this.state;
    if (!mobile) {
      Toast.show('请输入手机号码');
      return false;
    }
    if (!this.ValidMobile(mobile)) {
      Toast.show('请输入正确的手机号码');
      return false;
    }

    const {dispatch} = this.props;
    dispatch({
      type: 'NSLogin/login_get_code',
      payload: {
        mobile
      },
      callback: (res) => {
        if (res.success) {
          Toast.show('验证码发送成功，请注意查收');
          this.countdown();
        }
      }
    });
  }


  ValidMobile(val) {
    return (/^1[3456789]\d{9}$/.test(val));
  }

  countdown() {
    let {countdown} = this.state;
    if (this.state.countdown === 1) {
      this.setState({
        verifyTxt: "点击获取验证码",
        canSendCode: true,
        countdown: 60,
      });
      return false;
    }
    else {
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

  submit() {
    const {mobile, verifyCode, checked} = this.state;
    if (!mobile) {
      Toast.show('请输入手机号码');
      return false;
    }
    if (!this.ValidMobile(mobile)) {
      Toast.show('请输入正确的手机号码');
      return false;
    }

    if (!verifyCode && verifyCode.length !== 4) {
      Toast.show('请输入正确的验证码');
      return false;
    }

    if (!checked) {
      Toast.show('请先同意用户注册协议');
      return false;
    }

    /*发送请求*/
    const {dispatch} = this.props;
    dispatch({
      type: 'NSLogin/login_sign_in',
      payload: {
        mobile,
        verifyCode
      },
      callback: (res) => {
        if (res.success) {
          // if (this.TimeOutCount != null) clearTimeout(this.TimeOutCount);
          // this.props.navigation.navigate(Router.MAIN);

          const resetAction = StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({routeName: Router.MAIN})],
          });
          this.props.navigation.dispatch(resetAction);
        }
      }
    });

  }

  componentWillUnmount() {
    this.TimeOutCount != null && clearTimeout(this.TimeOutCount);
  }


  render() {
    const {verifyTxt, canSendCode, mobile} = this.state;
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView
          keyboardDismissMode={'on-drag'}
          keyboardShouldPersistTaps={'handled'}
          style={styles.page}>
          <View style={styles.contentContainer}>

            {/*关闭按钮*/}
            <Touchable
              activeOpacity={0.9}
              onPress={() => {
                // this.props.navigation.goBack(null);
                const resetAction = StackActions.reset({
                  index: 0,
                  actions: [NavigationActions.navigate({routeName: Router.MAIN})],
                });
                this.props.navigation.dispatch(resetAction);

              }} style={styles.close}>
              <Text style={styles.closeText}>

              </Text>
            </Touchable>

            {/*LOGO*/}
            <Image
              style={styles.logo}
              source={Images.auth.Logo}
              resizeMode={'contain'}/>

            {/*标题*/}
            <View style={styles.title}>
              <Text style={styles.titleText}>
                手机验证码登录
              </Text>
            </View>

            {/*表单*/}
            <View style={styles.form}>
              <View style={styles.formInput}>
                <TextInput
                  style={styles.input}
                  defaultValue={mobile}
                  onChangeText={(e) => {
                    this.setState({
                      mobile: e
                    })
                  }}
                  autoFocus={true}
                  keyboardType={'numeric'}
                  maxLength={11}
                  placeholderTextColor={'#A2A2A2'}
                  placeholder={'请输入手机号'}
                />
                {this.state.mobile !== '' && <Touchable
                  onPress={() => {
                    this.setState({
                      mobile: ''
                    })
                  }}>
                  <Image style={styles.clear} resizeMode={'contain'} source={Images.common.clear}/>
                </Touchable>}
              </View>
              <View style={styles.formInput}>
                <TextInput
                  style={styles.input}
                  maxLength={4}
                  onChangeText={(e) => {
                    this.setState({
                      verifyCode: e
                    })
                  }}
                  keyboardType={'numeric'}
                  placeholderTextColor={'#A2A2A2'}
                  placeholder={'请输入验证码'}
                />

                <View style={styles.formLine}>
                </View>
                <Touchable
                  onPress={() => {
                    canSendCode && this.GetVerifyCode();
                  }}
                  style={styles.btnVerify}>
                  <Text style={styles.btnVerifyText}>{verifyTxt}</Text>
                </Touchable>
              </View>
              {/*登录按钮*/}
            </View>

            <Button
              onPress={() => {
                this.submit();
              }} style={styles.btn}>登录</Button>

            {/*协议*/}
            <View style={styles.XieYi}>
              {/*checkbox*/}
              <CheckBox
                onChange={(flag) => {
                  this.setState({
                    checked: !flag
                  })
                }}
                isChecked={this.state.checked}/>

              <Text style={styles.XieYiText}>选择即同意</Text>
              <Touchable
                onPress={() => {
                  this.props.navigation.navigate(Router.WEB, {
                    title: "用户注册协议",
                    url: "http://47.99.0.78/html/regAgreement.html"
                  })
                }}>
                <Text style={styles.XieYiDesc}>《富贵钱包协议》</Text>
              </Touchable>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  page: {
    flex: 1
  },
  contentContainer: {
    position: 'relative',
    paddingTop: 35,
    width,
    flexDirection: 'column',
    alignItems: 'center',
  },
  close: {
    position: 'absolute',
    right: 15,
    top: 15,
  },
  closeText: {
    color: '#FF8700',
    fontSize: 16
  },
  logo: {
    width: 80,
    height: 83,
    marginBottom: 30
  },
  clear: {
    width: 18,
    height: 18
  },
  title: {
    marginBottom: 17
  },
  titleText: {
    fontSize: 18,
    color: "#1E1E1E"
  },
  form: {
    width:300,
    marginBottom: 30,
  },
  formInput: {
    height: 47,
    paddingTop: 7,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E9E9E9"
  },
  input: {
    padding: 0,
    flex: 1,
    height: 40,
    fontSize: 12,
    color: "#1e1e1e",
    paddingLeft: 5,
  },
  formLine: {
    width: 1,
    height: 21,
    backgroundColor: "#e9e9e9"
  },
  btnVerify: {
    width: 102,
    paddingRight: 2
  },
  btnVerifyText: {
    fontSize: 12,
    color: "#EB4542",
    lineHeight: 17,
    textAlign: "center"
  },
  btn: {
    height: 40,
    marginBottom: 20
  },
  XieYi: {
    width,
    flexDirection: 'row',
    height: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  XieYiText: {
    fontSize: 12,
    lineHeight: 20,
    color: "#A2A2A2"
  },
  XieYiDesc: {
    fontSize: 12,
    lineHeight: 20,
    color: "#A2A2A2"
  }
});
