import React from 'react'
import PropTypes from 'prop-types';
import {StyleSheet, Text, ScrollView, View, Image} from 'react-native'
import Button from "./Button";

import Touchable from "./Touchable";

class Dialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {title, visible, btnTxt, onClose, callback, children} = this.props;
    return (
      <View style={[styles.dialog]}>
        <Touchable
          onPress={() => {
            onClose && onClose();
          }}
          style={styles.dialogMask}>
        </Touchable>
        <View style={styles.dialogBox}>
          <View style={styles.dialogBody}>
            <View style={styles.dialogHeader}>
              <Text style={styles.dialogHeaderText}>{title || '温馨提示'}</Text>
            </View>
            <ScrollView style={styles.dialogContent}>
              {children}
            </ScrollView>
            <View style={styles.dialogFooter}>
              <Button
                style={styles.btn}
                textStyle={styles.btnText}
                onPress={() => {
                  onClose();
                  callback && callback();
                }}>{btnTxt || '完成'}</Button>
            </View>
          </View>
        </View>
      </View>
    )
  }
};

Dialog.propTypes = {
  title: PropTypes.string,
  visible: PropTypes.bool,
  btnTxt: PropTypes.string,
  onClose: PropTypes.func,
  callback: PropTypes.func
};

const styles = StyleSheet.create({
  dialog: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0
  },
  dialogMask: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  dialogBox: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center'
  },
  dialogBody: {
    width: 315,
    height: 477,
    borderRadius: 4,
    backgroundColor: '#fff',
    flexDirection: 'column'
  },
  dialogHeader: {
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomColor: "#E9E9E9",
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  dialogHeaderText: {
    fontSize: 18,
    color: "#1E1E1E",
    lineHeight: 25
  },

  dialogContent: {
    flex: 1
  },
  dialogFooter: {
    height: 50,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#E9E9E9",
    alignItems: 'center',
    justifyContent: 'center'
  },
  btn: {
    backgroundColor: "#fff",
  },
  btnText: {
    color: "#FF8700",
    fontSize: 16,
    lineHeight: 22
  }
});

export default Dialog
