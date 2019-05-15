import React, {Component} from 'react';
import {StackActions, NavigationActions, SafeAreaView} from 'react-navigation';
import {Platform, StyleSheet, Image, Text, View} from 'react-native';
import connect from "react-redux/es/connect/connect";
import {Button} from "../../components";
import {Images} from '../../common/images';
import Router from "../../Router";

type Props = {};
@connect(({app, loading, NSIndex}) => ({app, loading, NSIndex}))
export default class PayResult extends Component<Props> {
  static navigationOptions = (navigation) => {
    console.log(navigation);
    return {
      title: "收款"
    }
  };

  componentDidMount() {
    const {dispatch} = this.props;
    dispatch({
      type: "NSIndex/init_loan_info",
      payload: {}
    });
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <Image style={[styles.image]} source={Images.bill.LoanIng}
               resizeMode={'contain'}/>
        <View style={styles.desc}>
          <Text style={styles.descText}>
            您的还款正在处理中,请稍候……
          </Text>
          <Text style={styles.descText}>
            还款成功后会有短信通知，请注意查收
          </Text>
        </View>
        <Button
          style={styles.btn}
          onPress={() => {
            /*回到当前栈的第一个页面*/
            // this.props.navigation.dispatch(StackActions.popToTop());

            const resetAction = StackActions.reset({
              index: 0,
              actions: [NavigationActions.navigate({routeName: Router.MAIN})],
            });
            this.props.navigation.dispatch(resetAction);
          }}
        >确定</Button>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingTop: 30
  },
  image: {
    width: 315,
    height: 218,
    marginBottom: 30
  },
  desc: {
    marginBottom: 50,
    justifyContent: 'center'
  },
  descText: {
    fontSize: 16,
    lineHeight: 26,
    textAlign:'center',
    color: "#808080"
  },
  btn: {
    width:300
  },
});
