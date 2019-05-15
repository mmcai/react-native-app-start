import React, {Component} from 'react';
import {SafeAreaView} from 'react-navigation';
import {StyleSheet, WebView, View, Text, Image, Platform, TouchableOpacity} from 'react-native';
import {connect} from 'react-redux';
import {width} from "../../utils/screen";

@connect(({app, loading}) => ({app, loading}))
export default class Web extends Component {
  static  navigationOptions = ({navigation}) => {
    const {title} = navigation.state.params;
    return {
      title: title || 'WEB页面标题'
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      url: "",
      loading: true
    }
  }

  componentWillMount() {
    /*这里获取传递过来的参数*/
    const {url} = this.props.navigation.state.params;
    this.setState({
      url
    })
  }

  render() {
    const {url, loading} = this.state;
    return (
      <SafeAreaView style={styles.page}>
        {/*loading*/}
        {
          loading && <View style={styles.WebLoading}>
            {/*<Image resizeMode={'contain'}/>*/}
            <Text>加载中...</Text>
          </View>
        }
        {/*页面*/}
        {url && <WebView
          onLoadStart={() => {
            console.log("开始加载页面");
          }}
          domStorageEnabled={true}
          mixedContentMode={'always'}
          useWebKit={true}
          onLoad={() => {
            console.log("加载页面完成");
            this.setState({
              loading: false
            })

          }}
          source={{
            uri: url
          }}
          style={styles.WebView}
        />}
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  page: {
    position: 'relative',
    flex: 1
  },
  WebView: {
    flex: 1
  },
  WebLoading: {
    position: 'absolute',
    left: 0,
    top: 0,
    width,
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#fff"
  }
});
