import React, {Component} from 'react';
import {SafeAreaView} from 'react-navigation';
import {Platform, StyleSheet, Text, View} from 'react-native';
import {ShadowBox} from "../../components";
import {connect} from "react-redux";
import {width} from "../../utils/screen";
import {money} from '../../utils/filters'

type Props = {};
@connect(({app, loading}) => ({app, loading}))
export default class Message extends Component<Props> {
  static navigationOptions = (navigation) => {
    console.log(navigation);
    return {
      title: "消息"
    }
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <Text>消息列表</Text>
      </SafeAreaView>
    );
  }


}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: 'center',
    paddingTop: 15
  },
  card: {
    width: width - 30,
    height: 182,
    backgroundColor: "#fff",
    borderRadius: 4,
    alignItems: 'center',
    paddingTop: 30
  },
  title: {
    marginBottom: 10
  },
  titleText: {
    fontSize: 16,
    color: '#1E1E1E'
  },
  money: {
    marginBottom: 20,
  },
  moneyText: {
    fontSize: 30,
    color: '#4C7BFE'
  },
  footer: {
    width: width - 130,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  Fleft: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  label: {
    color: "#808080",
    fontSize: 12
  },
  value: {
    color: "#4C7BFE",
    fontSize: 16
  }
});
