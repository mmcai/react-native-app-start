import React from 'react'
import {StyleSheet, Text} from 'react-native'
import LinearGradient from 'react-native-linear-gradient';
import Touchable from './Touchable'

export const Button = ({text, children, style, textStyle, onPress}) => (
    <Touchable
      onPress={() => {
        onPress && onPress();
      }}
      style={[styles.button,style]}>
      <Text style={[styles.text, textStyle]}>{text || children}</Text>
    </Touchable>
);

const styles = StyleSheet.create({
  button: {
    width:300,
    height:40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "#EB4542",
    borderRadius:4
  },
  text: {
    fontSize: 18,
    textAlign: 'center',
    color: '#ffffff',
    backgroundColor: 'transparent'
  }
});

export default Button
