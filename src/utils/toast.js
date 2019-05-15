import Toast from 'react-native-root-tips';

Toast.setDefaultOptions({
  backgroundColor: 'black',
  opacity: 0.7,
  delay: 0,
  animation: false,
  hideOnPress: true,
  textColor: 'white',
  position:Toast.positions.CENTER,
  textStyle: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 17,
  }
});

export default Toast;
