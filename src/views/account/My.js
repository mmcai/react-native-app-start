import React, {Component} from 'react';
import {Platform, StyleSheet, Linking, Image, Text, View, TouchableOpacity} from 'react-native';
import {NavigationActions, StackActions, Storage, Toast} from '../../utils'
import {Line, Alert, Touchable} from "../../components/index";
import {width} from "../../utils/screen";
import Router from "../../Router";
import connect from "react-redux/es/connect/connect";
import {NavigationEvents, SafeAreaView} from "react-navigation";

type Props = {};
@connect(({app, loading}) => ({app, loading}))
export default class My extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      focused:this.props.navigation.isFocused(),
      visible: false,
      AlertText: ""
    };
  }

  componentDidMount() {
    // console.log(this.props.navigation.isFocused(), '个人中心');
  }

  async logout() {
    await Storage.removeValue("token");
    this.props.navigation.replace(Router.LOGIN);
  }

  render() {
    const {navigation} = this.props;
    const {AlertText} = this.state;
    const servicecell = this.props.app.ServiceCell;
    const {clientCell, loginState, clientName, certFlag} = this.props.app.user;

    const reg = /^(\d{3})\d{4}(\d{4})$/;

    const tel = clientCell && clientCell.replace(reg, "$1****$2");

    return (
      <SafeAreaView style={styles.container}>

        {/*订阅事件*/}
{/*        <NavigationEvents
          onDidFocus={payload => {
            console.log("onDidFocus", payload, '个人中心');
            // if (this.state.loaded) {
            //   this.init();
            // }
          }}
        />*/}

        <View style={styles.header}>
          <View style={styles.hMask}>
            <Image
              style={{width: '100%', height: '100%'}}
              resizeMode={'cover'}
              source={require('../../../assets/account/h-bg.png')}/>
          </View>
          <View style={styles.hInner}>
            <Image style={styles.hImg} source={require('../../../assets/account/avatar.png')}/>
            <View style={styles.hInfo}>
              <Text style={styles.hText}>{clientCell ? tel : '未认证'}</Text>
              {/*<Text style={styles.hText}>{clientName}</Text>*/}
            </View>

          </View>
        </View>

        <Line
          style={{marginBottom: 11}}
          onPress={() => {

            // this.props.navigation.navigate(Router.UPLOADRES);
            navigation.navigate(Router.LOAN_RECORD);
            // navigation.navigate(Router.LOAN_RESULT);

            // this.props.navigation.navigate(Router.PAYRESULT);
          }}
          icon={<Image
            style={{width: 16, height: 16, marginRight: 12}}
            resizeMode={'contain'}
            source={require('../../../assets/account/icon-loan.png')}/>}

          arrow={true}>我的借款</Line>

        <Line
          border={true}
          onPress={() => {
            //先弹框
            if (loginState === "AUDITED") {
              navigation.navigate(Router.QUOTA);
            }
            else if (loginState === "REFUSED") {
              Toast.show('您不符合本平台借款条件，无法进行此操作');
            } else {
              this.setState({
                visible: true,
                AlertText: "请先完成认证内容"
              });
            }
          }}
          icon={<Image
            style={{width: 16, height: 16, marginRight: 12}}
            resizeMode={'contain'}
            source={require('../../../assets/account/icon-quota.png')}/>}

          arrow={true}>我的额度</Line>
        {/*退出*/}
        <Line
          border={true}
          onPress={() => {
            if (loginState === "AUDITED") {
              navigation.navigate(Router.BANK);
            }
            else if (loginState === "REFUSED") {
              Toast.show('您不符合本平台借款条件，无法进行此操作');
            } else {
              this.setState({
                visible: true,
                AlertText: "请先完成认证内容"
              });
            }
          }}
          icon={<Image
            style={{width: 16, height: 16, marginRight: 12}}
            resizeMode={'contain'}
            source={require('../../../assets/account/icon-bank.png')}/>}

          arrow={true}>银行卡</Line>

        {/*弹框*/}
        <Alert
          title={'温馨提示'}
          message={AlertText}
          showCancelBtn={true}
          showConfirmBtn={true}
          cancelText={'取消'}
          confirmText={'去认证'}
          onClose={() => {
            this.setState({
              visible: false
            })
          }}
          onConfirm={() => {
            /*跳转到实名认证*/
            this.props.navigation.navigate(Router.AEESEE);
          }}
          visible={this.state.visible}/>

        <Touchable
          onPress={() => {
            this.logout();
          }}
          style={styles.logout}>
          <Text style={styles.logouText}>退出登录</Text>
        </Touchable>

        <View style={styles.footer}>
          <Text style={styles.footerText}>联系客服</Text>
          <Touchable onPress={() => {
            return Linking.openURL(`tel:${servicecell}`);
          }}>
            <Text style={{fontSize: 13, color: "#FF8700"}}>{servicecell}</Text>
          </Touchable>
        </View>

      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(244,245,250,1)',
  },
  header: {
    position: 'relative',
    width,
    height: 106,

    justifyContent: 'center',
    marginBottom: 11
  },
  hMask: {
    position: 'absolute',
    left: 0,
    top: 0,
    width,
    height: 106,
    zIndex: 1000
  },
  hInner: {
    position: 'absolute',
    left: 0,
    top: 0,
    width,
    height: 106,
    paddingLeft: 15,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 2000
  },
  hImg: {
    width: 50,
    height: 50,
    marginRight: 18
  },
  hInfo: {
    flexDirection: 'column'
  },
  hText: {
    fontSize: 16,
    color: "#fff"
  },
  logout: {
    width,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 80,
    marginTop: 20,
    backgroundColor: "#fff"
  },
  logouText: {
    fontSize: 15,
    color: "#1E1E1E"
  },
  footer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  footerText: {
    fontSize: 13,
    color: "#808080",
    textAlign: 'center'
  }
});
