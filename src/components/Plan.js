import React from 'react';
import {StyleSheet, Text, View} from 'react-native'
import {money} from "../utils";
import moment from 'moment';

class Plan extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {

    const RenderMonth = this.props.data.map((item, index) => {
      return (
        <View key={index} style={styles.bpitem}>
          <View style={styles.bpheader}>
            <View style={styles.bhleft}>
              <Text style={styles.pindex}>
                第{item.planIndex}期
              </Text>
            </View>
            <View style={styles.bhright}>
              <Text style={styles.status}>
                还款日{moment(item.planDate).format("YYYY.MM.DD")}
              </Text>
            </View>
          </View>

          <View style={styles.bpbody}>
            <View style={[styles.pline, {height: 30}]}>
              <Text style={[styles.ptitle, {fontSize: 18, lineHeight: 22, color: "#1e1e1e"}]}>
                应还金额
              </Text>
              <Text style={[styles.pvalue, {fontSize: 18, lineHeight: 22, color: "#1e1e1e"}]}>
                ¥ {money(item.planAmt)}
              </Text>
            </View>
            <View style={styles.pline}>
              <Text style={styles.ptitle}>
                本金
              </Text>
              <Text style={styles.pvalue}>
                ¥ {money(item.planBen)}
              </Text>
            </View>
            <View style={styles.pline}>
              <Text style={styles.ptitle}>
                利息
              </Text>
              <Text style={styles.pvalue}>
                ¥ {money(item.planXi)}
              </Text>
            </View>
          </View>
        </View>
      )
    });
    return (
      <View style={styles.planBox}>
        {RenderMonth}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  planBox: {
    paddingHorizontal: 15,
    paddingBottom: 10,
  },
  bpitem: {
    height: 120,
    paddingVertical: 8,
    borderBottomColor: "#E9E9E9",
    borderBottomWidth: 1
  },
  bpheader: {
    height: 22,
    flexDirection: 'row',
    alignItems: 'center'
  },
  bhleft: {
    flex: 1
  },
  pindex: {
    color: "#24BFF2",
    fontSize: 16,
    lineHeight: 22
  },
  bhright: {
    flex: 1
  },
  status: {
    color: "#808080",
    fontSize: 16,
    lineHeight: 22,
    textAlign: 'right'
  },
  bpbody: {
    flexDirection: 'column',
    marginTop: 2
  },
  pline: {
    height: 25,
    flexDirection: 'row',
    alignItems: 'center'
  },
  plinetitle: {},
  ptitle: {
    width: 75,
    fontSize: 13,
    color: "#bbbbbb",
    lineHeight: 18,
    textAlign: 'right'
  },
  pvalue: {
    flex: 1,
    fontSize: 13,
    color: "#bbbbbb",
    lineHeight: 18,
    textAlign: 'right'
  }
});

export default Plan;
