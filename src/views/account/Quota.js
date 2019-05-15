import React, {Component} from 'react';
import {SafeAreaView} from 'react-navigation';
import {Platform, StyleSheet, Text, View} from 'react-native';
import {ShadowBox} from "../../components";
import {connect} from "react-redux";
import {width} from "../../utils/screen";
import {money} from '../../utils/filters'

type Props = {};
@connect(({app, loading}) => ({app, loading}))
export default class Home extends Component<Props> {
  static navigationOptions = (navigation) => {
    console.log(navigation);
    return {
      title: "我的额度"
    }
  };

  constructor(props) {
    super(props);
    this.state = {}
  }

  render() {
    const {topAmt, loginState} = this.props.app.user;
    return (
      <SafeAreaView style={styles.container}>
        <ShadowBox height={182}>
          <View style={styles.card}>
            <View style={styles.title}>
              <Text style={styles.titleText}>授信额度(元)</Text>
            </View>
            <View style={styles.money}>
              <Text style={styles.moneyText}>{loginState === 'REFUSED' ? money(0) : money(topAmt)}</Text>
            </View>
          </View>
        </ShadowBox>
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
    justifyContent:'center',
    paddingTop: 30
  },
  title: {
    marginBottom: 16
  },
  titleText: {
    fontSize: 16,
    color: '#1E1E1E'
  },
  money: {
    marginBottom: 35,
  },
  moneyText: {
    fontSize: 30,
    color: '#FF604F'
  },
  footer: {
    width: width - 90,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  fLine: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  label: {
    color: "#808080",
    fontSize: 12
  }
});
