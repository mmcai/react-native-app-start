import React from 'react'
import PropTypes from 'prop-types';
import {StyleSheet, Text, View, Image} from 'react-native'
import Button from "./Button";

class Confirm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {title, visible, cancelTxt, confirmTxt, onClose, cancel, confirm, children} = this.props;
    return (
      <View style={[styles.dialog]}>
        <View style={styles.dialogMask}>
        </View>
        <View style={styles.dialogBox}>
          <View style={styles.dialogBody}>
            <View style={styles.dialogHeader}>
              <Text style={styles.dialogHeaderText}>{title || '温馨提示'}</Text>
            </View>
            <View style={styles.dialogContent}>
              {children}
            </View>
            <View style={styles.dialogFooter}>
              <Button
                style={styles.cancelBtn}
                textStyle={styles.cancelBtnTxt}
                onPress={() => {
                  onClose();
                  cancel && cancel();
                }}>{cancelTxt || '取消'}</Button>
              <Button
                style={styles.confirmBtn}
                textStyle={styles.confirmBtnTxt}
                onPress={() => {
                  onClose();
                  confirm && confirm();
                }}>{confirmTxt || '完成'}</Button>
            </View>
          </View>
        </View>
      </View>
    )
  }
};

Confirm.propTypes = {
  title: PropTypes.string,
  visible: PropTypes.bool,
  cancelTxt: PropTypes.string,
  confirmTxt: PropTypes.string,
  onClose: PropTypes.func,
  confirm: PropTypes.func,
  cancel: PropTypes.func,
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
    height: 200,
    borderRadius: 5,
    backgroundColor: '#fff',
    flexDirection: 'column',
    overflow: "hidden"
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
    flex: 1,
    paddingHorizontal: 15
  },
  dialogFooter: {
    flexDirection: 'row',
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopColor: "#bbb",
    borderTopWidth: StyleSheet.hairlineWidth
  },
  cancelBtn: {
    flex: 1,
    height: 44,
    borderRadius: 0,
    backgroundColor: "#fff",
    borderRightColor: "#bbb",
    borderRightWidth: StyleSheet.hairlineWidth
  },
  cancelBtnTxt: {
    color: "#bbb",
    fontSize: 14
  },
  confirmBtn: {
    flex: 1,
    height: 44,
    backgroundColor: "#fff",
    borderRadius: 0
  },
  confirmBtnTxt: {
    color: "#24BFF2",
    fontSize: 14
  }
});

export default Confirm
