import React, {Component} from 'react';
import {NavigationEvents, SafeAreaView} from 'react-navigation';
import {StyleSheet, ScrollView, Image, Text, View} from 'react-native';
import connect from "react-redux/es/connect/connect";
import Button from "../../components/Button";
import {width, height} from "../../utils/screen";
import Router from "../../Router";
import {Images} from '../../common/images';
import _ from 'lodash';
import LinearGradient from 'react-native-linear-gradient';

type Props = {};
@connect(({app, loading, NSBank}) => ({app, loading, NSBank}))
export default class Bank extends Component<Props> {
  static navigationOptions = (navigation) => {
    console.log(navigation);
    return {
      title: "我的银行卡"
    }
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.init();
  }

  init() {
    const {dispatch} = this.props;
    dispatch({
      type: "NSBank/eff_bank_info",
      payload: {},
      callback: (res) => {
        console.log(res);
      }
    })
  }

  render() {
    const bankInfo = this.props.app.bank;

    /*没绑卡*/
    let RenderBank = <View style={styles.bankNull}>
      <Image style={styles.nullImg}
             resizeMode={'contain'}
             source={Images.bank.Null}>
      </Image>
      <Text style={styles.nullDesc}>没有绑定的银行卡</Text>
      <Button
        onPress={() => {
          this.props.navigation.navigate(Router.BANKNEW);
        }}
        style={styles.nullBtn}>
        添加银行卡
      </Button>
      <Text style={styles.footerText}>
        您在本平台绑定的银行卡将作为提现和还款的银行卡
      </Text>
    </View>;


    if (!_.isEmpty(bankInfo) && bankInfo !== null) {
      const {netLogo, openBankName, bankAccount4} = bankInfo;
      RenderBank = <View style={styles.bankView}>
        <View style={styles.bankCard}>
          <LinearGradient
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            colors={['#DF5B5B', '#FAA896']}
            style={styles.bankCardLinear}
          >
            <View style={styles.bankCardIcon}>
              <Image
                style={styles.bankCardIconImg}
                source={{
                  uri: netLogo
                }}
                resizeMode={'contain'}/>
            </View>
            <View style={styles.bankCardBody}>
              <View style={styles.cardTop}>
                <Text style={styles.bankCardName}>{openBankName}</Text>
                <Text style={styles.bankCardDesc}>储蓄卡</Text>
              </View>
              <View style={styles.cardBot}>
                <Text style={styles.cardBotText}>**** **** **** {bankAccount4}</Text>
              </View>
            </View>
          </LinearGradient>
        </View>
        <View style={styles.bankDesc}>
        {/*  <Button
            onPress={() => {
              this.props.navigation.navigate(Router.BANKNEW);
            }}
            style={styles.bankDescBtn}>重新绑卡</Button>*/}
          <Text style={styles.bankDescText}>您在本平台绑定的银行卡将作为提现和还款的银行卡</Text>
        </View>
      </View>
    }

    return (
      <SafeAreaView style={styles.container}>
        <NavigationEvents
          onDidFocus={() => {
            this.init();
          }}
        />
        {/*卡片信息*/}
        {RenderBank}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  /*没有绑卡信息*/
  bankNull: {
    position: 'relative',
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: "#FFF"
  },
  nullImg: {
    width: 315,
    height: 218,
    marginBottom: 30,
    marginTop: 30
  },
  nullDesc: {
    fontSize: 16,
    color: "#808080",
    marginBottom: 80
  },
  nullBtn: {},
  footerText: {
    position: 'absolute',
    width,
    left: 0,
    bottom: 28,
    textAlign: 'center',
    fontSize: 12,
    lineHeight: 17,
    color: "#bbb"
  },
  /*有卡片信息*/
  bankView: {
    flex: 1,
    backgroundColor: "#FFF",
    padding: 15
  },
  bankCard: {
    position: 'relative',
    height: 140
  },
  bankCardLinear: {
    flex: 1,
    height: 140,
    borderRadius: 4,
    paddingTop: 20,
    paddingBottom: 30,
    paddingLeft: 75,
    paddingRight: 60
  },
  bankCardBody: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  cardTop: {
    flex: 1
  },
  bankCardIcon: {
    position: 'absolute',
    left: 20,
    top: 20,
    width: 42,
    height: 42,
    borderRadius: 21
  },
  bankCardIconImg: {
    width: 42,
    height: 42
  },

  bankCardName: {
    color: '#FFF',
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 5
  },
  bankCardDesc: {
    color: '#FFF',
    fontSize: 12,
    lineHeight: 17
  },
  cardBot: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-end'
  },
  cardBotText: {
    color: '#FFF',
    fontSize: 20,
    lineHeight: 28
  },
  bankDesc: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  bankDescBtn: {
    marginTop: 65,
  },
  bankDescText: {
    fontSize: 12,
    lineHeight: 17,
    color: "#BBB"
  },
});
