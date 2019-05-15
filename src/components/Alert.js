import React from 'react'
import PropTypes from 'prop-types';
import {StyleSheet} from 'react-native'
import AwesomeAlert from 'react-native-awesome-alerts';

class Alert extends React.Component {

  constructor(props) {
    super(props);
    this.state = {}
  }

  render() {
    const {visible, title, message, msgStyle, showCancelBtn, showConfirmBtn, onClose, onConfirm, cancelText, confirmText,} = this.props;
    return (
      <AwesomeAlert
        show={visible}

        alertContainerStyle={styles.alert}
        contentContainerStyle={styles.body}
        titleStyle={styles.title}
        overlayStyle={styles.overlay}
        messageStyle={[styles.msg, msgStyle]}
        cancelButtonColor={'transparent'}
        confirmButtonColor={'transparent'}
        cancelButtonStyle={styles.btnCancel}
        confirmButtonStyle={styles.btnConfirm}
        cancelButtonTextStyle={styles.btnCancelText}
        confirmButtonTextStyle={styles.btnConfirmText}

        showProgress={false}
        title={title}
        message={message}

        closeOnTouchOutside={true}
        closeOnHardwareBackPress={false}
        showConfirmButton={showConfirmBtn}
        showCancelButton={showCancelBtn}
        confirmText={confirmText ? confirmText : '去认证'}
        cancelText={cancelText ? cancelText : '取消'}

        onDismiss={()=>{
          onClose && onClose();
        }}

        onCancelPressed={() => {
          onClose && onClose();
        }}
        onConfirmPressed={() => {
          onClose && onClose();
          onConfirm && onConfirm();
        }}
      >

      </AwesomeAlert>
    )
  }
};

const styles = StyleSheet.create({
  alert: {
    padding: 0,
    zIndex: 9999
  },
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.3)'
  },
  title: {
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 18,
    color: "#1E1E1E",
    paddingVertical: 15,
  },
  body: {
    width: 315,
    flexDirection: 'column',
    padding: 0,
  },
  msg: {
    width: '100%',
    textAlign: 'center',
    height: 80,
    lineHeight: 80,
    paddingBottom: 20
  },

  /*底部按钮*/
  btnCancel: {
    flex: 1,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 0,
    borderColor: "#E9E9E9",
    borderRightWidth: StyleSheet.hairlineWidth,
  },
  btnConfirm: {
    flex: 1,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 0,
  },
  btnCancelText: {
    color: "#808080",
    fontSize: 16
  },
  btnConfirmText: {
    color: "#EB4542",
    fontSize: 16
  }
});

Alert.propTypes = {
  visible: PropTypes.bool,
  msgStyle: PropTypes.object,
  showCancelBtn: PropTypes.bool,
  showConfirmBtn: PropTypes.bool,
  title: PropTypes.string,
  cancelText: PropTypes.string,
  confirmText: PropTypes.string,
  onClose: PropTypes.func,
  onConfirm: PropTypes.func,
};

export default Alert
