import React, {Component} from 'react';
import axios from 'axios'
import {connect} from 'react-redux';
import {SafeAreaView} from 'react-navigation';
import ImagePicker from 'react-native-image-picker';
import {ScrollView, StyleSheet, Text, Image, View} from 'react-native';
import Button from "../../components/Button";
import {Alert, Touchable} from "../../components";
import {width} from "../../utils/screen";
import {Permissions, Storage, Toast} from "../../utils";
import Router from "../../Router";
import Contacts from "react-native-contacts";

type Props = {};
@connect(({app, loading, NSAuthName}) => ({app, loading, NSAuthName}))
export default class Home extends Component<Props> {
  static navigationOptions = () => {
    return {
      title: "实名认证"
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      visible1: false,
      AlertText: "到期日期小于1个月，请先办理最新身份证后再来认证",
      visibleMsg: "",
      back: false,
      front: false,
      certName: "",
      certNo: "",
      startDate: "",
      endDate: "",
      imgCertFront: "",
      imgCertBack: "",
      imgFront: "https://m.zhanhaijingji.cn/public/assets/cert/img-cert-front.png",
      imgBack: "https://m.zhanhaijingji.cn/public/assets/cert/img-cert-back.png"
    };
  }

  componentDidMount() {
    /*获取通讯录*/

  }

  /*认真身份证正面*/
  ocrAuthFront(fileName,preview) {
    const {dispatch} = this.props;
    dispatch({
      type: 'NSAuthName/eff_upload_front',
      payload: {
        show: true,
        fileName: fileName
      },
      callback: (res) => {
        Toast.hide();
        if (res.success) {
          const {name, certNo, filePath} = res.result;

          console.log(res.result, '身份证正面信息');
          if (name && certNo) {
            this.setState({
              certName: name,
              certNo,
              front: true,
              imgCertFront: fileName,
              imgFront: preview
            });
            Toast.show("证件识别成功");
          } else {
            // this.setState({
            //   front: false,
            //   imgFront: preview
            // });
            Toast.show("证件识别失败，请重新上传");
          }
        }
      }
    });
  }

  /*认真身份证正面*/
  ocrAuthBack(fileName,preview) {
    const {dispatch} = this.props;
    dispatch({
      type: 'NSAuthName/eff_upload_back',
      payload: {
        show: true,
        fileName: fileName
      },
      callback: (res) => {
        Toast.hide();
        if (res.success) {

          const {endDate, startDate, filePath} = res.result;
          if (startDate !== null) {
            this.setState({
              startDate,
              endDate,
              back: true,
              imgCertBack: fileName,
              imgBack: preview
            });
            Toast.show("证件识别成功");
          }
          else {
            // this.setState({
            //   back: true,
            //   imgBack: filePath
            // });
            Toast.show("证件识别失败，请重新上传");
          }
        }
      }
    });
  }


  /*正面上传*/
  choiceImg(type) {
    const options = {
      title: null,
      mediaType: 'photo',
      cameraType: 'back',
      noData: false,
      quality: 1.0,
      maxWidth: 750,
      maxHeight: 750,
      storageOptions: {
        skipBackup: true,
        waitUntilSaved: true,
        cameraRoll: true,
        path: '/'
      },
    };
    ImagePicker.launchCamera(options, (response) => {
      console.log(response, '图片选择');

      if (response.didCancel) {
        //  用户取消选择图片了
        // console.log("禁用?")
        // Toast.show("金银花需要您的授权，才可以继续工作，请到软件设置里面重新配置");
      }
      else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
        // Toast.show("金银花需要您的授权，才可以继续工作，请到软件设置里面重新配置2");
        this.setState({
          visible1: true
        })
        //  选图片报错
      } else if (response.customButton) {
        //  自定义按钮
      } else {
        const source = {uri: response.uri, type: 'application/octet-stream', name: response.fileName};
        /*图片上传*/
        const {dispatch} = this.props;
        dispatch({
          type: 'NSAuthName/eff_upload_info',
          payload: {
            fileType: "CERT",
            show: true,
            fileName: response.fileName
          },
          callback: (res) => {
            if (res.success) {
              this.setState({
                oss: res.result
              });

              //正在上传
              Toast.showLoading('正在上传...', {
                position: Toast.positions.CENTER
              });

              const {host, accessId, dir, policy, signature} = res.result;
              const data = new FormData();
              data.append("key", dir);
              data.append("policy", policy);
              data.append("OSSAccessKeyId", accessId);
              data.append("success_action_status", '200');
              data.append("Signature", signature);
              //添加压缩过的图片
              data.append("file", source, response.fileName);

              /*   let baseUrl = host;
                 if (window.location.protocol === 'https:' && baseUrl.match('https') === null) {
                   baseUrl = baseUrl.replace('http', 'https');
                 }*/
              Toast.showLoading('正在识别身份证...', {
                position: Toast.positions.CENTER
              });
              /*上传到OSS*/
              axios({
                url: host,
                method: 'post',
                data: data,
                headers: {
                  'Content-Type': 'multipart/form-data'
                }
              }).then(res => {
                if (res.status === 200) {
                  console.log(`${host}/${dir}`);
                  if (type === 'front') {
                    this.ocrAuthFront(dir,response.uri)
                  } else {
                    this.ocrAuthBack(dir,response.uri)
                  }
                } else {
                  Toast.hide();
                }
              }).catch(e => {
                // Toast.hide();
                console.log(e);
                Toast.show('图片上传失败');
              })
            }
          }
        });

      }
    });
  }

  /*提交上传*/
  submit() {
    const {certName, certNo, startDate, endDate, imgCertBack, imgCertFront} = this.state;
    const {dispatch} = this.props;
    dispatch({
      type: 'NSAuthName/eff_cert_submit',
      payload: {
        certBack: imgCertBack,
        certFront: imgCertFront,
        certNo,
        clientName: certName,
        endDate,
        startDate,
      },
      callback: (res) => {
        if (res.success) {
          const data = res.result;
          if (data === 'NO') {
            this.setState({
              visible: true,
              visibleMsg: res.message
            });

          } else {
            this.props.navigation.goBack(null);
          }
        }
      }
    });

  }

  render() {
    const {back, front, imgFront, imgBack, certName, certNo} = this.state;
    const flag = back && front;
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.page}>
          {/*上传部分*/}
          <View style={styles.card}>
            <View style={styles.title}>
              <Text style={styles.titleText}>上传清晰的身份证照片<Text style={{color: '#BE987B'}}>（请横向拍摄）</Text></Text>
            </View>
            <View style={styles.body}>
              <View style={styles.certFront}>
                <Touchable
                  onPress={() => {
                    this.choiceImg('front');
                  }}
                  style={styles.certBox}>
                  <Image
                    resizeMode={'cover'}
                    style={styles.certImg}
                    source={{uri: imgFront}}/>
                </Touchable>
              </View>
              <View style={styles.certBack}>
                <Touchable
                  onPress={() => {
                    this.choiceImg('back');
                  }}
                  style={styles.certBox}>
                  <Image
                    resizeMode={'cover'}
                    style={styles.certImg}
                    source={{uri: imgBack}}/>
                </Touchable>
              </View>
            </View>
          </View>
          {/*信息展示部分*/}
          <View style={[styles.card, {marginBottom: 15}]}>
            <View style={styles.title}>
              <Text style={styles.titleText}>请确认以下信息，如若有误请点按上图重新拍摄</Text>
            </View>
            <View style={[styles.body, {paddingVertical: 0, paddingHorizontal: 0, paddingLeft: 15}]}>
              <View style={styles.line}>
                <Text style={styles.label}>真实姓名</Text>
                <Text style={styles.value}>
                  {certName ? certName : '上传图片后自动识别'}
                </Text>
              </View>
              <View style={styles.line}>
                <Text style={styles.label}>身份证号</Text>
                <Text style={styles.value}>
                  {certNo ? certNo : '上传图片后自动识别'}
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
        {/*按钮*/}
        <Button
          textStyle={[styles.btnText, flag ? styles.btnUsableText : null]}
          onPress={() => {
            flag && this.submit();
          }}
          style={[styles.btn, flag ? styles.btnUsable : null]}>提交</Button>

        <Alert
          title={'错误提示'}
          message={<View style={{alignItems: 'center'}}>
            <Text style={{color: "#808080"}}>{this.state.visibleMsg}，</Text>
            <Text style={{color: "#808080"}}>请先办理最新身份证后再来认证</Text>
          </View>}
          showCancelBtn={false}
          showConfirmBtn={true}
          confirmText={'确定'}
          onClose={() => {
            this.setState({
              visible: false
            })
          }}
          visible={this.state.visible}/>

        {/*授权弹框*/}
        <Alert
          title={'温馨提示'}
          message={'金银花需要你的授权，才能继续工作'}
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
    backgroundColor: '#F5FCFF',
    paddingBottom: 50
  },
  page: {
    flex: 1,
    backgroundColor: '#F4F5FA'
  },
  card: {},
  title: {
    height: 30,
    paddingLeft: 15,
    justifyContent: 'center'
  },
  titleText: {
    color: '#808080',
    fontSize: 12,
    lineHeight: 17
  },
  body: {
    paddingVertical: 32,
    paddingHorizontal: 39,
    backgroundColor: "#fff",
    alignItems:'center'
  },
  certFront: {
    marginBottom: 22,
    width: 297,
    height: 146,
    backgroundColor: '#F4F5FA',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#E9E9E9'
  },
  certBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 146
  },
  certImg: {
    width: 297,
    height: 146
  },
  certBack: {
    width: 297,
    height: 146,
    backgroundColor: '#F4F5FA',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#E9E9E9'
  },
  line: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: "#E9E9E9",
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  label: {
    width: 80,
    fontSize: 15,
    color: "#1E1E1E",
    lineHeight: 21
  },
  value: {
    flex: 1,
    fontSize: 15,
    color: "#BBB",
    lineHeight: 21
  },
  btn: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    width,
    borderRadius: 0,
    height: 48,
    backgroundColor: '#D0D4DB'
  },
  btnText: {
    color: "#FFF",
    fontSize: 18,
    lineHeight: 25
  },
  btnUsable: {
    backgroundColor: '#EB4542'
  },
  btnUsableText: {
    color: "#FFF"
  }
});
