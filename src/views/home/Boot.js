import React, {Component} from 'react';
import {SafeAreaView} from 'react-navigation';
import {StyleSheet, View, Text, Image, Platform, TouchableOpacity} from 'react-native';
import {connect} from 'react-redux';
import SplashScreen from "react-native-splash-screen";
import VersionNumber from 'react-native-version-number';
import {StackActions, Storage} from '../../utils'
import Router from '../../Router'
import Swiper from 'react-native-swiper';

const IMAGE_MODE = Platform.OS === 'android' ? 'cover' : 'cover';
@connect(({app, loading}) => ({app, loading}))
export default class Boot extends Component {
  static  navigationOptions = () => {
    return {
      header: null
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      index: null,
      login: false,
      showBoot: false
    }
  }

  componentDidMount() {
    //获取版本号，如果当前保存的版本号和现在APP的版本号不一样，这个页面显示，否则，这个页面直接重定向到首页
    // this.GetSplashVersion();
    // this.getverison();

    this.props.navigation.replace(Router.MAIN);
  }

  async getverison() {
    const ver = Storage.getValue("splashversion");
    /*版本号*/
    ver
      .then((res) => {
        if (res == null || res !== VersionNumber.buildVersion) {
          this.setState({
            showBoot: true
          })
        } else {
          this.props.navigation.replace(Router.MAIN);
        }
      })
      .catch(err => {
        console.log(err, '获取版本号失败');
      });

    SplashScreen.hide();
  }

  /*这个方法没用了*/
  async GetSplashVersion() {

    const token = Storage.getValue('token');
    /*登录验证信息*/
    token.then(result => {
      if (result === null) {
        this.props.navigation.replace(Router.LOGIN);
      } else {
        this.props.navigation.replace(Router.MAIN);
      }
    }).catch(err => {
      console.log(err, '获取登录验证信息失败')
    });

    SplashScreen.hide();
  }

  GoToNext() {
    Storage.setValue('splashversion', VersionNumber.buildVersion);
    this.props.navigation.replace(Router.MAIN);
  }

  render() {
    const {index, showBoot} = this.state;
    const RenderDot = <View style={styles.dot}></View>;
    const RenderActiveDot = <View style={styles.dotActive}></View>;
    const RenderBtn = <TouchableOpacity onPress={this.GoToNext.bind(this)} activeOpacity={1} style={styles.sBtn}>
      <Text style={styles.sBtnText}>立即体验</Text>
    </TouchableOpacity>;
    return (
      <SafeAreaView style={styles.page}>
        {showBoot && <Swiper
          onIndexChanged={(index) => {
            this.setState({
              index
            })
          }}
          dot={RenderDot}
          activeDot={RenderActiveDot}
          paginationStyle={{
            bottom: 68
          }}
          loop={false}
          showsButtons={false}>
          <View style={styles.sItem}>
            <Image style={styles.sImg} resizeMode={IMAGE_MODE} source={require('../../../assets/guide/guide-1.jpg')}/>
          </View>
          <View style={styles.sItem}>
            <Image style={styles.sImg} resizeMode={IMAGE_MODE} source={require('../../../assets/guide/guide-2.jpg')}/>
          </View>
          <View style={styles.sItem}>
            <Image style={styles.sImg} resizeMode={IMAGE_MODE} source={require('../../../assets/guide/guide-3.jpg')}/>
          </View>
          <View style={styles.sItem}>
            <Image style={styles.sImg} resizeMode={IMAGE_MODE} source={require('../../../assets/guide/guide-4.jpg')}/>
          </View>
        </Swiper>}
        {/*页面跳转按钮*/}
        {index === 3 && RenderBtn}
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  page: {
    position: "relative",
    flex: 1
  },
  dot: {
    backgroundColor: '#bfbfbf',
    width: 9,
    height: 9,
    borderRadius: 5,
    marginHorizontal: 4
  },
  dotActive: {
    backgroundColor: '#3e88f3',
    width: 9,
    height: 9,
    borderRadius: 5,
    marginHorizontal: 4
  },
  sItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  sImg: {
    width: '100%',
    height: '100%'
  },
  sBtn: {
    position: 'absolute',
    left: "50%",
    bottom: 20,
    marginLeft: -60,
    width: 120,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#3e88f3",
    alignItems: 'center',
    justifyContent: 'center'
  },
  sBtnText: {
    color: "#3e88f3",
    fontSize: 14
  }
});
