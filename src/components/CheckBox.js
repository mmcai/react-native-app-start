import React, {PureComponent} from 'react'
import {StyleSheet, View, Image, TouchableHighlight} from 'react-native'
import {Images} from "../common/images";

const checkedImage = Images.auth.CheckBoxedImg;
const checkImage = Images.auth.CheckBoxImg;

export default class CheckBox extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isChecked: this.props.isChecked || false
    };
  }

  getChecked() {
    return this.state.isChecked;
  }

  setChecked(isChecked) {
    this.setState({
      isChecked: isChecked
    });
  }

  checkClick() {
    this.setState({
      isChecked: !this.state.isChecked
    });

    this.props.onChange && this.props.onChange(this.state.isChecked);
  }

  render() {
    return (
      <TouchableHighlight underlayColor={'transparent'} onPress={() => this.checkClick()}>
        <Image source={this.state.isChecked ? checkedImage : checkImage} style={styles.checkImage}/>
      </TouchableHighlight>
    );
  }
}
const styles = StyleSheet.create({
  checkImage: {
    marginRight: 4,
    height: 12,
    width: 12
  }
});
