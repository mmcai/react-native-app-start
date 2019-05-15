import React, {Component} from 'react';
import axios from 'axios'
import {connect} from 'react-redux';
import {SafeAreaView, NavigationEvents} from 'react-navigation';
import {ScrollView, StyleSheet, TextInput, Text, Image, View, PermissionsAndroid, BackHandler} from 'react-native';
import Button from "../../components/Button";
import {Alert, Touchable} from "../../components";
import {width} from "../../utils/screen";
import {Storage, Toast, Permissions} from "../../utils";
import Router from "../../Router";
import {Images} from "../../common/images";
import ContactsWrapper from 'react-native-contacts-wrapper-pro';
import DeviceInfo from 'react-native-device-info';
import Contacts from "react-native-contacts";
import Permission from 'react-native-permissions'

type Props = {};
@connect(({app, loading}) => ({app, loading}))
export default class Personal extends Component<Props> {
  static navigationOptions = () => {
    return {
      title: "个人信息"
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      flag: false,
      visible1: false,
      applyAddress: "",
      workAddress: "",
      friendCell: "",
      linkerData: "",
      parentCell: ""
    };
  }

  componentDidMount() {
    this.init();
  }

  async init() {
    const self = this;
    const device = {};
    device.DeviceID = DeviceInfo.getUniqueID();
    device.UserAgent = DeviceInfo.getUserAgent();
    device.DeviceBrand = DeviceInfo.getBrand();
    device.DeviceModel = DeviceInfo.getModel();
    device.SystemVersion = DeviceInfo.getSystemVersion();
    device.AppVersion = DeviceInfo.getVersion();
    device.AppReadableVersion = DeviceInfo.getReadableVersion();

    if (device.SystemVersion[0] < 6) {
      try {
        Contacts.getAll((err, res) => {
          if (err) {
            throw err;
          }
          Storage.setValue('contact', JSON.stringify(res));

          console.log(res.length,'通讯录位数');

          if (res.length) {
            console.log("设置不允许了");
            self.setState({
              flag: true
            });
          }

          self.setState({
            linkerData: JSON.stringify(res)
          })
        });
      } catch (e) {
        console.log(e, '错误信息');
      }
    }
  }

  async checkPermission(n) {
    const PermissionsContactKey = 'READ_CONTACTS';
    const checkContact = await Permissions.check(PermissionsContactKey);
    const self = this;

    console.log(this.state.flag, '那个啥');

    if (checkContact) {
      if(DeviceInfo.getSystemVersion()[0]<6){
        if (this.state.flag) {
          console.log("设置不允许了2");
          this.chooseContact(n);
          const contactData = Storage.getValue('contact');
          contactData.then(res => {
            console.log(res, '通讯录缓存');
            if (res) {
              self.setState({
                linkerData: res
              })
            } else {
              Contacts.getAllWithoutPhotos((err, res) => {
                if (err) console.log("读取失败");
                console.log(res, '通讯录');
                Storage.setValue('contact', JSON.stringify(res));
                self.setState({
                  linkerData: JSON.stringify(res)
                })
              });
            }
          });
        }else{
          console.log("设置不允许了3");
          this.setState({
            visible1: true
          });
        }
      }
      else{
        this.chooseContact(n);
        const contactData = Storage.getValue('contact');
        contactData.then(res => {
          console.log(res, '通讯录缓存');
          if (res) {
            self.setState({
              linkerData: res
            })
          } else {
            Contacts.getAllWithoutPhotos((err, res) => {
              if (err) console.log("读取失败");
              console.log(res, '通讯录');
              Storage.setValue('contact', JSON.stringify(res));
              self.setState({
                linkerData: JSON.stringify(res)
              })
            });
          }
        });
      }
    }
    else {
      const req = Permissions.get(PermissionsContactKey);
      req.then(res => {
        switch (res) {
          case "granted":
            /*调用通讯录选择*/
            Contacts.getAllWithoutPhotos((err, res) => {
              if (err) console.log("读取失败");

              console.log(res, '通讯录');
              Storage.setValue('contact', JSON.stringify(res));
              self.setState({
                linkerData: JSON.stringify(res)
              })
            });

            this.chooseContact(n);
            break;
          case "denied":
          case "never_ask_again":
            // Toast.show("您需要设置权限才可以继续执行以下的操作");

            self.setState({
              visible: true
            });

            break;
        }
      }).catch(err => {
        console.log(err);
        Toast.show('发生未知错误', {
          mask: true
        });
      })
    }
  }

  chooseContact(n) {
    const self = this;

    try {
      const GetContact = ContactsWrapper.getContact();
      console.log(GetContact, '内容');
      if (GetContact) {
        GetContact.then((contact) => {
          console.log(contact, '这个报错的');
          const phone = contact.phone.replace(/\s/g, '').replace(/-/g, '');
          if (n === 1) {
            const name2 = self.state.parentCell;
            if (phone !== name2) {
              self.setState({
                friendCell: phone
              })
            } else {
              Toast.show('两个联系人信息不能相同');
            }
          }
          else {
            const name1 = self.state.friendCell;
            if (phone !== name1) {
              self.setState({
                parentCell: phone
              })
            } else {
              Toast.show('两个联系人信息不能相同');
            }
          }
        }).catch(err => {
          Toast.show("您取消了联系人选择");
          console.log(err, '取消通讯录选择');
        })
      } else {
        console.log('fuck', '报');
      }

    } catch (e) {
      console.log(e, '选取通讯录失败');
    }

  }

  submit() {
    const {dispatch, navigation} = this.props;
    const {applyAddress, workAddress, friendCell, linkerData, parentCell} = this.state;
    dispatch({
      type: "NSAuthName/eff_contact_submit",
      payload: {
        applyAddress,
        workAddress,
        friendCell,
        linkerData,
        parentCell
      },
      callback: (res) => {
        if (res.success) {
          navigation.goBack(null);
        }
      }
    })

  }

  render() {
    const {workAddress, applyAddress, friendCell, parentCell} = this.state;


    return (
      <SafeAreaView style={styles.container}>
        <NavigationEvents
          onDidFocus={() => {
            // this.init();
          }}
        />
        <ScrollView
          keyboardDismissMode={'on-drag'}
          keyboardShouldPersistTaps={'handled'}
          style={styles.body}>
          <View style={styles.title}>
            <Text style={styles.titleText}>基本信息</Text>
          </View>
          <View style={styles.content}>
            <View style={styles.formItem}>
              <View style={styles.formLabel}>
                <Text style={styles.formLabelText}>家庭住址</Text>
              </View>
              <View style={styles.formContent}>
                <TextInput
                  onChangeText={(text) => {
                    this.setState({
                      applyAddress: text
                    })
                  }}
                  value={applyAddress}
                  numberOfLines={4}
                  style={styles.formInput}
                  multiline={true}
                  placeholder={'请输入家庭详细地址'}
                  placeholderTextColor={'#bbb'}/>
              </View>
            </View>
            <View style={styles.formItem}>
              <View style={styles.formLabel}>
                <Text style={styles.formLabelText}>工作地址</Text>
              </View>
              <View style={styles.formContent}>
                <TextInput
                  onChangeText={(text) => {
                    this.setState({
                      workAddress: text
                    })
                  }}
                  value={workAddress}
                  numberOfLines={4}
                  style={styles.formInput}
                  multiline={true}
                  placeholder={'请输入工作详细地址'}
                  placeholderTextColor={'#bbb'}/>
              </View>
            </View>
          </View>
          <View style={styles.title}>
            <Text style={styles.titleText}>联系人信息</Text>
          </View>
          <View style={styles.content}>
            <View style={styles.formLine}>
              <Text style={styles.formLineLabel}>家人</Text>
              <Touchable
                onPress={() => {
                  this.checkPermission(1);
                }}
                style={styles.formLineContent}>
                <Text style={[styles.formLineInput,friendCell?{color:"#808080"}:{color:"#BBBBBB"}]}>{friendCell ? friendCell : '请选择'}</Text>
                <Image resizeMode={'contain'} source={Images.auth.IconPerson} style={styles.formIcon}/>
                <Image resizeMode={'contain'} source={Images.common.ArrowRight} style={styles.formArrow}/>
              </Touchable>
            </View>
            <View style={styles.formLine}>
              <Text style={styles.formLineLabel}>同事/朋友</Text>
              <Touchable
                onPress={() => {
                  this.checkPermission(2);
                }}
                style={styles.formLineContent}>
                <Text style={[styles.formLineInput,parentCell?{color:"#808080"}:{color:"#BBBBBB"}]}>{parentCell ? parentCell : '请选择'}</Text>
                <Image resizeMode={'contain'} source={Images.auth.IconPerson} style={styles.formIcon}/>
                <Image resizeMode={'contain'} source={Images.common.ArrowRight} style={styles.formArrow}/>
              </Touchable>
            </View>

          </View>
        </ScrollView>
        {/*按钮*/}
        <Button
          textStyle={[styles.btnText, workAddress && applyAddress && friendCell && parentCell ? styles.btnUsableText : null]}
          onPress={() => {
            workAddress && applyAddress && friendCell && parentCell && this.submit();
          }}
          style={[styles.btn, workAddress && applyAddress && friendCell && parentCell ? styles.btnUsable : null]}>提交</Button>


        <Alert
          title={'温馨提示'}
          message={'金银花需要你的授权，才能继续工作'}
          showCancelBtn={false}
          showConfirmBtn={true}
          confirmText={'确定'}
          onClose={() => {
            this.setState({
              visible: false
            })
          }}
          visible={this.state.visible}/>


        <Alert
          title={'温馨提示'}
          message={<View style={{alignItems: 'center', justifyContent: 'center'}}>
            <Text>无法读取联系人信息</Text>
            <Text>请确保您的联系人权限已授权</Text>
          </View>}
          showCancelBtn={false}
          showConfirmBtn={true}
          confirmText={'确定'}
          onClose={() => {
            this.setState({
              visible1: false
            })
          }}
          visible={this.state.visible1}/>

      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#F4F5FA',
  },
  body: {
    flex: 1
  },
  title: {
    height: 30,
    paddingLeft: 15,
    justifyContent: 'center'
  },
  titleText: {
    fontSize: 12,
    lineHeight: 18,
    color: "#808080"
  },
  content: {
    backgroundColor: "#FFF"
  },
  formLabel: {
    borderBottomColor: "#E9E9E9",
    borderBottomWidth: StyleSheet.hairlineWidth,
    justifyContent: 'center',
    paddingLeft: 15,
    height: 50
  },
  formLabelText: {
    fontSize: 15,
    lineHeight: 22,
    color: "#1e1e1e"
  },
  formContent: {
    height: 100,
    paddingHorizontal: 15,
    paddingTop: 10
  },
  formInput: {
    flex: 1,
    fontSize: 15,
    padding: 0,
    color: "#808080",
    textAlignVertical: 'top'
  },

  /*联系人信息*/
  formLine: {
    height: 50,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: "#E9E9E9",
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  formLineLabel: {
    width: 90,
    textAlign: 'left'
  },
  formLineContent: {
    flex: 1,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
  },
  formLineInput: {
    flex: 1,
    color:"#808080"
  },
  formIcon: {
    width: 17,
    height: 19,
    marginRight: 5
  },
  formArrow: {
    width: 12,
    height: 12
  },
  /*底部按钮*/
  btn: {
    width,
    height: 48,
    borderRadius: 0,
    backgroundColor: "#D0D4DB"
  },
  btnUsable: {
    backgroundColor: "#EB4542"
  },
  btnUsableText: {
    color: "#FFF"
  }
});
