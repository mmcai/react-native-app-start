import React from 'react'
import {StyleSheet, Text} from 'react-native'
import Touchable from './Touchable'

export const Button = ({text, children, style, textStyle, ...rest}) => (
  <Touchable style={[styles.button, style]} {...rest}>
    <Text style={[styles.text, textStyle]}>{text || children}</Text>
  </Touchable>
);

const styles = StyleSheet.create({
  button: {
    width: 300,
    height: 48,
    borderRadius: 4,
    backgroundColor: '#EB4542',
    alignItems: 'center',
    justifyContent: 'center'
  },
  text: {
    fontSize: 18,
    color: '#fff',
  },
});

export default Button
