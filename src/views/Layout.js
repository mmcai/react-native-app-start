import React, {Component} from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {createBottomTabNavigator} from 'react-navigation';
import My from './account/My';
import Bill from './bill/Bill';
import Home from './home/Home';
import Router from "../Router";
import {Images} from "../common/images";
import {Storage} from "../utils";

const LayoutScreen = createBottomTabNavigator(
  {
    HOME: {
      screen: Home,
      navigationOptions: {
        tabBarLabel: "借款",
        tabBarIcon: ({tintColor, focused}) => (
          focused ? <Image style={styles.tabBarIcon} source={Images.tabs.HomeSelected}/> :
            <Image style={styles.tabBarIcon} source={Images.tabs.Home}/>
        )
      }
    },
    BILL: {
      screen: Bill,
      navigationOptions: {
        tabBarLabel: "还款",
        tabBarIcon: ({tintColor, focused}) => (
          focused ? <Image style={styles.tabBarIcon} source={Images.tabs.BillSelected}/> :
            <Image style={styles.tabBarIcon} source={Images.tabs.Bill}/>
        )
      }
    },
    MY: {
      screen: My,
      navigationOptions: {
        tabBarLabel: "我的",
        tabBarIcon: ({tintColor, focused}) => (
          focused ? <Image style={styles.tabBarIcon} source={Images.tabs.AccountSelected}/> :
            <Image style={styles.tabBarIcon} source={Images.tabs.Account}/>
        )
      }
    }
  },
  {
    tabBarPosition: 'bottom', //位置
    lazy: true, //是否禁用立即呈现所有tab
    swipeEnabled: false, // 禁止左右滑动
    animationEnabled: false,
    initialRouteName: Router.HOME,
    tabBarOptions: {
      allowFontScaling: true,
      activeTintColor: '#4A4B5B', // 文字和图片选中颜色
      inactiveTintColor: '#A2A2A2', // 文字和图片默认颜色
      showIcon: true, // android 默认不显示 icon, 需要设置为 true 才会显示
      style: {
        height: 49,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: "#e0e0e0",
        backgroundColor: '#ffffff', // TabBar 背景色
        marginTop: 0,
        marginBottom: 0,
        paddingBottom: 0,
        paddingTop: 0
      },
      tabStyle: {
        paddingBottom: 5,
        paddingTop: 5
      },
      labelStyle: {
        fontSize: 11,
        marginTop: 0,
        marginBottom: 0,
        paddingBottom: 0,
        paddingTop: 0
      },
      iconStyle: {
        padding: 0,
        margin: 0
      },
      indicatorStyle: {
        height: 0
      }
    },
    navigationOptions: {
      tabBarOnPress: ({navigation, defaultHandler}) => {
        const token = Storage.getValue('token');
        token.then((res) => {
          if (res === null) {
            navigation.navigate(Router.LOGIN);
          } else {


            defaultHandler();


          }
        });
      }
    }
  });

LayoutScreen.navigationOptions = ({navigation}) => {
  const routes = navigation.state.routes;
  const index = navigation.state.index;
  let titleText = "标题";
  if (routes) {
    switch (index) {
      case 0:
        titleText = '富贵钱包';
        break;
      case 1:
        titleText = '还款';
        break;
      case 2:
        titleText = '我的';
        break;
    }
  }
  return ({
    headerLeft: <View style={[{minWidth: 40, paddingLeft: 10}]}/>,
    title: titleText
  })
};

const styles = StyleSheet.create({
  tabBarIcon: {
    width: 20,
    height: 20
  }
});

export default LayoutScreen;
