import React from 'react'
import {width} from "../utils/screen";
import {BoxShadow} from 'react-native-shadow'

export const ShadowBox = ({children, height, shadowConfig}) => {

  const shadowOpt = {
    width: width - 30,
    height: height || 200,
    color: "#000",
    border: 5,
    radius: 4,
    opacity: 0.1,
    x: 0,
    y: 1,
    style: {}
  };
  return (
    <BoxShadow setting={shadowConfig ? shadowConfig : shadowOpt}>
      {children}
    </BoxShadow>);
};



export default ShadowBox
