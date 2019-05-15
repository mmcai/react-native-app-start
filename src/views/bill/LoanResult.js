import React, {Component} from 'react';
import {StackActions, NavigationActions, SafeAreaView} from 'react-navigation';
import {Platform, StyleSheet, Image, Text, View} from 'react-native';
import {Button} from "../../components";
import {Images} from "../../common/images";
import Router from "../../Router";
import {Toast} from "../../utils";
import connect from "react-redux/es/connect/connect";

type Props = {};
@connect(({app, loading, NSIndex, NSLoan}) => ({app, loading, NSIndex, NSLoan}))
export default class Home extends Component<Props> {
  static navigationOptions = (navigation) => {
    console.log(navigation);
    return {
      title: "放款中"
    }
  };

  componentDidMount() {
    const {dispatch} = this.props;
    dispatch({
      type: "NSIndex/init_loan_info",
      payload: {},
    });

    /*借款详情*/
    // dispatch({
    //   type: 'NSLoan/loan_info',
    //   payload: {},
    //   callback: (res) => {
    //     console.log(res, '借款信息');
    //     Toast.hide();
    //
    //   }
    // });
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <Image
          source={Images.loan.Confirm}
          resizeMode={'contain'}
          style={styles.image}/>
        <Text style={styles.desc}>
          正在放款中，请注意查收银行卡
        </Text>
    {/*    <Text style={[styles.desc, {marginBottom: 65}]}>
          预计在30分钟内到账，以银行实际到账为准
        </Text>*/}
         <Button
          onPress={() => {
            this.props.navigation.popToTop();
          }}
          style={styles.btn}>完成</Button>
     {/*   <View style={{flex: 1, paddingBottom: 5, alignItems: 'center', justifyContent: 'flex-end'}}>
          <Text style={styles.descTextFooter}>注：9:00~18:00以外时间段，放款时间有延迟</Text>
        </View>*/}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  image: {
    width: 315,
    height: 218,
    marginTop: 30,
    marginBottom: 30,
  },
  desc: {
    fontSize: 16,
    marginBottom:80,
    lineHeight: 26,
    color: "#808080"
  },
  btn: {
    height: 44,
    borderRadius: 4
  },
  descTextFooter: {
    fontSize: 13,
    lineHeight: 18,
    color: "#A2A2A2"
  }
});

