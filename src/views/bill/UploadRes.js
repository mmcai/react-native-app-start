import React, {Component} from 'react';
import {StackActions, NavigationActions, SafeAreaView} from 'react-navigation';
import {Platform, StyleSheet, Image, Text, View} from 'react-native';
import connect from "react-redux/es/connect/connect";
import {Button} from "../../components";
import {Images} from '../../common/images';
import Router from "../../Router";
import axios from 'axios'
import {money, Toast} from "../../utils";
import {width} from "../../utils/screen";
import Touchable from "../../components/Touchable";
import ImagePicker from 'react-native-image-picker';

type Props = {};
@connect(({app, loading, NSCashier, NSAuthName, NSIndex}) => ({app, loading, NSCashier, NSAuthName, NSIndex}))
export default class PayResult extends Component<Props> {
  static navigationOptions = (navigation) => {
    console.log(navigation);
    return {
      title: "上传转账凭证"
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      imgList: [],
      uploadList: [],
      payMoney: 0,
      loanNo: null,
      payBody: ""
    };
  }

  componentDidMount() {
    const money = this.props.navigation.getParam('money', null);
    const loanNo = this.props.navigation.getParam('loanNo', null);
    const payBody = this.props.navigation.getParam('payBody', null);
    if (money !== null && loanNo !== null && payBody !== null) {
      this.setState({
        payMoney: money,
        loanNo,
        payBody
      })
    }
  }

  uploadImg(source, response) {
    const {dispatch} = this.props;
    dispatch({
      type: "NSAuthName/eff_upload_info",
      payload: {
        fileType: "BACKED",
        fileName: response.fileName
      },
      callback: (res) => {
        console.log(res, '上传的结果');
        if (res.success) {
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
              console.log(`${dir}`);
              /*上传队列*/
              const uploadList = this.state.uploadList;
              /*预览队列*/
              const imgList = this.state.imgList;

              imgList.push(source);
              uploadList.push(dir);

              /*添加到待上传的列表*/
              this.setState({
                uploadList,
                imgList
              })
            }
            Toast.hide();
          }).catch(e => {
            // Toast.hide();
            console.log(e);
            Toast.show('图片上传失败');
          })
        }
      }
    });
  }

  uploadImgs(data) {
    const {dispatch} = this.props;
    dispatch({
      type: "NSCashier/eff_upload_repay",
      payload: {
        base64: data.uri
      },
      callback: (res) => {
        console.log(res, '上传的结果');
        if (res.success) {
          /*上传队列*/
          const uploadList = this.state.uploadList;
          /*预览队列*/
          const imgList = this.state.imgList;

          imgList.push(data);
          uploadList.push(res.result);

          /*添加到待上传的列表*/
          this.setState({
            uploadList,
            imgList
          })
        }
      }
    });
  }

  /*上传图片选择*/
  choiceImg() {
    const options = {
      title: '拍照或选择照片',
      mediaType: 'photo',
      cameraType: 'back',
      noData: true,
      quality: 1.0,
      isVertical: false,
      maxWidth: 750,
      maxHeight: 750,
      storageOptions: {
        skipBackup: true,
        cameraRoll: false,
        path: '/'
      },
    };
    ImagePicker.launchImageLibrary(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('用户取消选择图片了');
      } else if (response.error) {

        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        // const source = { uri: response.uri };
        console.log(response.data, 'base64数据');
        // You can also display the image using data:

        const source = {
          uri: response.uri,
          type: 'application/octet-stream',
          name: response.fileName
        };


        /*上传*/
        this.uploadImg(source, response);
      }
    });

  }


  /*提交转账还款内容还款*/
  submit() {
    const {dispatch} = this.props;
    const {payMoney, payBody, loanNo, uploadList} = this.state;
    dispatch({
      type: "NSCashier/eff_repay_submit",
      payload: {
        attachPathList: uploadList,
        loanNo,
        backedAmt: payMoney,
        loanBackType: payBody === 'all' ? 'SETTL' : 'EXTENSION',
        transferType: "TRANSFER",
      },
      callback: (res) => {
        if (res.code === '200') {
          this.props.navigation.navigate(Router.PAYRESULT);
        } else {
          this.setState({
            dialogCard: false
          });

          Toast.show('您的操作失败次数过多，请选择其他方式！');
        }
      }
    });
  }

  /*删除图片*/
  delImgList(index) {
    const {uploadList, imgList} = this.state;
    uploadList.splice(index, 1);
    imgList.splice(index, 1);

    /*然后再重新赋值*/
    this.setState({
      uploadList,
      imgList
    })
  }

  render() {
    const {imgList, payMoney} = this.state;
    /*渲染图片列表*/
    const RenderImgList = imgList.map((item, index) => {
      return (
        <View key={index} style={styles.uploadItem}>
          <Image style={styles.uploadImg} resizeMode={'cover'} source={item}/>
          {/*删除按钮*/}
          <Touchable
            onPress={() => {
              this.delImgList(index);
            }}
            style={styles.uploadClose}>
            <Image style={{width: 16, height: 16}} resizeMode={'contain'} source={Images.upload.del}/>
          </Touchable>
        </View>
      )
    });

    return (
      <SafeAreaView style={styles.container}>
        {/*顶部提示*/}
        <View style={styles.topTips}>
          <Text style={styles.topTipsText}>以app提供还款信息为准，切勿相信任何个人提供的还款方式！</Text>
        </View>

        {/*还款金额*/}
        <View style={styles.repayInfo}>
          <Text style={styles.repayLabel}>
            还款金额(元)
          </Text>
          <Text style={styles.repayValue}>
            {money(payMoney)}
          </Text>
        </View>

        {/*转账凭证*/}
        <View style={styles.uploadBox}>
          <Text style={styles.uploadTitle}>请上传转账凭证</Text>
          <View style={styles.uploadList}>
            {/*图片内容*/}
            {RenderImgList}
            {/*添加图片*/}
            {this.state.imgList.length !== 6 && <Touchable
              onPress={() => {
                this.choiceImg();
              }}
              style={[styles.uploadItem, styles.uploadBtn]}>
              <Image style={{width: 105, height: 105}} resizeMode={'contain'} source={Images.upload.add}/>
            </Touchable>}
          </View>
        </View>
        {/*底部按钮*/}
        <View style={styles.uploadFot}>
          <Text style={styles.uploadFotText}>工作时间为9点~18点</Text>
          <Button
            style={styles.btn}
            onPress={() => {
              this.submit();
              /*回到当前栈的第一个页面*/
              // this.props.navigation.dispatch(StackActions.popToTop());
              // const resetAction = StackActions.reset({
              //   index: 0,
              //   actions: [NavigationActions.navigate({routeName: Router.MAIN})],
              // });
              // this.props.navigation.dispatch(resetAction);
            }}
          >提交</Button>
        </View>

      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#F4F5FA'
  },
  /*头部提示*/
  topTips: {
    width,
    height: 26,
    backgroundColor: 'rgba(243, 146, 144, 0.35)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  topTipsText: {
    color: '#EB4542',
    fontSize: 12,
    lineHeight: 17
  },
  /*还款金额*/
  repayInfo: {
    height: 57,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E6E6E6",
    backgroundColor: "#FFF"
  },
  repayLabel: {
    fontSize: 16,
    color: "#1E1E1E"
  },
  repayValue: {
    fontSize: 24,
    color: "#EB4542"
  },

  /*上传凭证*/
  uploadBox: {
    padding: 15,
    height: 320,
    paddingRight: 0,
    backgroundColor: "#FFF"
  },
  uploadTitle: {
    fontSize: 12,
    color: "#808080",
    marginBottom: 15,
  },
  uploadList: {
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
  uploadItem: {
    position: 'relative',
    width: 105,
    height: 105,
    marginRight: 10,
    marginBottom: 15
  },
  uploadClose: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 16,
    height: 16,
    zIndex: 9999
  },
  uploadImg: {
    width: 105,
    height: 105
  },
  uploadBtn: {
    backgroundColor: "#F3F3F3",
    alignItems: 'center',
    justifyContent: 'center'
  },
  /*底部内容*/
  uploadFot: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: 'center',
  },
  uploadFotText: {
    fontSize: 12,
    color: "#808080",
    marginBottom: 5
  },
  btn: {
    width,
    height: 48,
    borderRadius: 0
  },
});
