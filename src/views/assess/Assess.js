import React, {Component} from 'react';
import {NavigationActions, NavigationEvents, SafeAreaView, StackActions} from 'react-navigation';
import {StyleSheet, View} from 'react-native';
import {Alert, Button, Line} from "../../components";
import {width} from "../../utils/screen";
import connect from "react-redux/es/connect/connect";
import Router from "../../Router";

type Props = {};
@connect(({app, NSIndex, loading}) => ({app, NSIndex, loading}))
export default class Assess extends Component<Props> {

  static navigationOptions = (navigation) => {
    console.log(navigation);
    return {
      title: "认证资料"
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      visible: false
    }
  }

  componentDidMount() {
    this.init();
  }

  init() {
    const {dispatch} = this.props;
    dispatch({
      type: "NSIndex/client_auth_get",
      payload: {}
    })
  }

  submit() {
    const {dispatch} = this.props;
    dispatch({
      type: "NSAuthName/eff_auth_submit",
      payload: {},
      callback: () => {
        const resetAction = StackActions.reset({
          index: 0,
          actions: [NavigationActions.navigate({routeName: Router.MAIN})],
        });
        this.props.navigation.dispatch(resetAction);
      }
    })
  }

  render() {
    const {user} = this.props.app;
    let RenderCertLine = <Line
      border={true}
      onPress={() => {
        this.props.navigation.navigate(Router.AUTH_NAME);
      }}
      text={'实名认证'}
      extraStyle={{color: "#FF604F"}}
      extra={'未认证'}
      arrow={true}/>;

    let RenderPersonLine = <Line
      border={true}
      onPress={() => {
        if (user.certFlag === 'YES') {
          this.props.navigation.navigate(Router.PERSIONAL);
        } else {
          this.setState({
            visible: true
          })
        }

      }}
      text={'个人信息'}
      extraStyle={{color: "#FF604F"}}
      extra={'未认证'}
      arrow={true}/>;

    let RenderBtn = <Button style={[styles.btn, {backgroundColor: '#D0D4DB'}]} textStyle={styles.btnText}>提交</Button>;

    if (user.certFlag === 'YES') {
      RenderCertLine = <Line  border={true} text={'实名认证'} extraStyle={{color: "#4C7BFE"}} extra={'已认证'} arrow={true}/>
    }


    if (user.linkerFlag === 'YES') {
      RenderPersonLine = <Line border={true} text={'个人信息'} extraStyle={{color: "#4C7BFE"}} extra={'已认证'} arrow={true}/>
    }


    if (user.loginState === 'CREATED' && user.certFlag === 'YES' && user.linkerFlag === 'YES') {
      RenderBtn = <Button
        onPress={() => {
          this.submit();
        }}
        style={[styles.btn]}
        textStyle={styles.btnText}>提交</Button>
    }


    return (
      <SafeAreaView style={styles.container}>
        <NavigationEvents
          onDidFocus={() => {
            this.init();
          }}
        />

        <View style={styles.body}>
          {/*实名认证*/}
          {RenderCertLine}

          {/*个人信息*/}
          {RenderPersonLine}
        </View>
        {/*提交按钮*/}
        {RenderBtn}

        {/*弹框提示*/}
        <Alert
          title={'温馨提示'}
          message={'请先完成实名认证后，再完善个人信息'}
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
            this.props.navigation.navigate(Router.AUTH_NAME);
          }}
          visible={this.state.visible}/>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#F8F8F9',
  },
  body: {
    flex: 1,
    paddingTop: 10
  },
  btn: {
    width,
    height: 48,
    borderRadius: 0
  },

});
