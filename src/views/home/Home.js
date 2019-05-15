import React, {Component} from 'react';
import {connect} from 'react-redux';
import {RefreshControl, Dimensions, ScrollView, Image, StyleSheet, Text, View} from 'react-native';
import Swiper from 'react-native-swiper';
import {Button, LinearButton} from "../../components";
import {BoxShadow} from 'react-native-shadow'
import {money, Storage} from "../../utils";
import Router from "../../Router";
import moment from 'moment';
import {Images} from "../../common/images";
import {NavigationEvents, SafeAreaView} from "react-navigation";


const {width} = Dimensions.get('window');
type Props = {};

const shadowOpt = {
  width: width - 30,
  height: 262,
  color: "#000",
  border: 5,
  radius: 4,
  opacity: 0.1,
  x: 0,
  y: 1,
  style: {}
};

const shadowOptLoan = {
  ...shadowOpt,
  height: 152,
};

@connect(({app, loading, NSIndex, NSAuthName}) => ({app, loading, NSIndex, NSAuthName}))
export default class Home extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      focused: this.props.navigation.isFocused(),
      loaded: false,
      isLogin: false,
      refreshing: false,
      showIntro: true,
      visible: true
    };
    this.btnHandle = (e) => {
      this.props.navigation.navigate(Router.LOGIN);
    }
  }

  componentWillMount() {
    this.isLogin();
  }

  /*如果登录，就去请求数据*/
  async isLogin() {
    const token = await Storage.getValue('token');

    console.log(token, 'token内容');
    if (token !== null) {
      this.setState({
        isLogin: true
      });
      this.init();
      this.initServiceCell();
    }
  }

  _onRefresh = () => {
    if (this.state.isLogin) {
      this.setState({refreshing: true});
      this.initServiceCell();
      this.init(() => {
        this.setState({refreshing: false});
      })
    }
  };

  initServiceCell() {
    const {dispatch} = this.props;
    dispatch({
      type: "NSIndex/client_service_cell",
      payload: {
        show: false
      }
    });
  }

  init(callback) {
    const {dispatch} = this.props;
    dispatch({
      type: "NSIndex/client_auth_get",
      payload: {},
      callback: (res) => {
        if (res.success) {
          const {loginState} = res.result;
          switch (loginState) {
            case "AUDITED":
              dispatch({
                type: "NSIndex/init_loan_info",
                payload: {
                  show: false
                },
                callback: (res) => {
                  if (res.success) {
                    const result = res.result;
                    if (result !== null) {
                      const {status, loanNo} = result;
                      switch (status) {
                        case "OVERDUED":
                          dispatch({
                            type: "NSIndex/init_overdue_info",
                            payload: {
                              loanNo
                            }
                          });
                          break;
                      }
                    }
                  }
                }
              });
              break;
          }
        }
        callback && callback();
      }
    })
  }

  render() {
    //定义变量
    let
      title = '最高可借(元)',
      statusc = "CREATED",
      amount = "50000",
      desc = "",
      btnTxt = '立即提现',
      btntype = 'primary',
      repayTime = '',
      repayDay = '',
      overduedDay = '',
      overduedRate = '';

    //当前用户状态
    const {loginState, topAmt} = this.props.NSIndex.user;
    switch (loginState) {
      case "CREATED":
        title = "最高可借(元)";
        statusc = "CREATED";
        amount = "50000";
        desc = "";
        btnTxt = "立即借款";
        btntype = "primary";

        this.btnHandle = () => {
          this.props.navigation.navigate(Router.AEESEE);
        };
        break;
      case "REFUSED":
        title = "最高可借(元)";
        amount = "0";
        statusc = "REFUSED";
        btnTxt = "立即借款";
        desc = "您提交的资料不符合本平台借款条件";
        btntype = "disabled";
        break;
      case "AUDITED":
        const loan = this.props.NSIndex.loan;
        if (loan === null) {
          title = "可用额度(元)";
          amount = topAmt;
          desc = "";
          btnTxt = "立即借款";
          btntype = "primary";
          statusc = "CREATED";
          this.btnHandle = () => {
            this.props.navigation.navigate(Router.LOAN);
          };
        }
        else {
          const {status, loanAmt, leftDays, endDate} = loan;
          switch (status) {
            case "INIT":
            case "SUBMITED":
            case "RAISECONFIRM":
              title = "可用额度(元)";
              amount = loanAmt;
              desc = "";
              btnTxt = "立即借款";
              btntype = "disabled";
              statusc = "APPROVAL";

              break;

            case "AUDITED":
              title = "待还金额(元)";
              amount = loanAmt;
              repayTime = endDate;
              repayDay = leftDays;
              desc = "及时还款，保持良好信用";
              btnTxt = "去还款";
              btntype = "primary";
              statusc = "USED";

              //去结清
              this.btnHandle = () => {
                this.props.navigation.navigate(Router.CASHIER, {status: "LOAN", source: "HOME"});
              };
              break;
            //还款待确认
            case "REPAYCONFIRM":
              title = "还款待确认";
              amount = '';
              desc = "还款处理中，请稍候... 您的还款正在处理中，请刷新查看状态";
              btnTxt = "还款处理中";
              btntype = "disabled";
              statusc = "REPAY";
              break;

            case "OVERDUED":
              const overdue = this.props.NSIndex.overdue;
              const {remainAmt, overdueDays, overdueAmt} = overdue;

              title = "待还金额(元)";
              amount = overdueAmt;
              desc = "你已逾期，请尽快还款";
              btnTxt = "去还款";
              overduedDay = overdueDays;
              overduedRate = remainAmt;
              btntype = "primary";
              statusc = "OVERDUED";

              //逾期 去结清
              this.btnHandle = () => {
                this.props.navigation.navigate(Router.CASHIER, {status: "OVERDUE", source: "HOME"});
              };
              break;
          }
        }
        break;
    }

    /*特性*/
    const RenderFlexIcon = <View style={styles.loanFeature}>
      <View style={styles.fItem}>
        <Image
          style={styles.fImg}
          resizeMode={'contain'}
          source={Images.home.Icon1}/>
        <Text style={styles.fText}>放款快</Text>
      </View>
      <View style={styles.fItem}>
        <Image
          style={styles.fImg}
          resizeMode={'contain'}
          source={Images.home.Icon2}/>
        <Text style={styles.fText}>额度高</Text>
      </View>
      <View style={styles.fItem}>
        <Image
          style={styles.fImg}
          resizeMode={'contain'}
          source={Images.home.Icon3}/>
        <Text style={styles.fText}>利息低</Text>
      </View>
    </View>;

    /*没借款*/
    let RenderBody = <View style={styles.card}>
      <BoxShadow setting={shadowOpt}>
        <View style={styles.cardBody}>
          <Text style={styles.loanTitle}>
            {title}
          </Text>
          <Text style={styles.loanMoney}>
            {money(amount)}
          </Text>
          <View style={styles.loanDesc}>
            <Text style={styles.loanDescTxt}>
              {desc}
            </Text>
          </View>
          {/*特性*/}
          {RenderFlexIcon}
        </View>
      </BoxShadow>
    </View>;
    /*没有提交评估*/


    /*评估通过——可借，新创建，额度关闭，评估中*/
    const RenderDefault = <View style={styles.card}>
      <BoxShadow setting={shadowOpt}>
        <View style={styles.cardBody}>
          <Text style={styles.loanTitle}>
            {title}
          </Text>
          <Text style={styles.loanMoney}>
            {money(amount)}
          </Text>
          <View style={styles.loanDesc}>
            <Text style={styles.loanDescTxt}>
              {desc}
            </Text>
          </View>
          {/*特性*/}
          {RenderFlexIcon}
        </View>
      </BoxShadow>
    </View>;

    /*评估已审核——不通过*/
    const RenderRefused = <View style={styles.card}>
      <BoxShadow setting={shadowOpt}>
        <View style={styles.cardBody}>
          <Image
            style={styles.rImg}
            resizeMode={'contain'}
            source={Images.home.IconRefused}
            alt={'拒绝'}/>

          <View style={styles.loanDesc}>
            <Text style={[styles.loanDescTxt, styles.loanDescTxtRefused, {color: '#FF604F'}]}>
              {desc}
            </Text>
          </View>
          {/*特性*/}
          {RenderFlexIcon}
        </View>
      </BoxShadow>
    </View>;

    /*审批中*/
    const RenderApproval = <View style={styles.card}>
      <BoxShadow setting={shadowOpt}>
        <View style={styles.cardBody}>
          <Image
            style={styles.ingImg}
            resizeMode={'contain'}
            source={Images.home.IconIng}
            alt={'审批中'}/>

          <View style={styles.Desc}>
            <Text
              style={[styles.loanDescTxt, styles.loanDescTxtRefused, {fontSize: 15, lineHeight: 23, color: "#808080"}]}>
              系统打款中，请稍后...
            </Text>
            <Text
              style={[styles.loanDescTxt, styles.loanDescTxtRefused, {fontSize: 15, lineHeight: 23, color: "#808080"}]}>
              预计在30分钟内到账，以银行实际到账为准
            </Text>
          </View>
        </View>
      </BoxShadow>
    </View>;

    /*还款确认中*/
    const RenderRepay = <View style={styles.card}>
      <BoxShadow setting={shadowOpt}>
        <View style={styles.cardBody}>
          <Image
            style={styles.ingImg}
            resizeMode={'contain'}
            source={Images.home.IconIng}
            alt={'还款确认中'}/>

          <View style={styles.Desc}>
            <Text
              style={[styles.loanDescTxt, styles.loanDescTxtRefused, {fontSize: 15, lineHeight: 23, color: "#808080"}]}>
              还款处理中，请稍候...
            </Text>
            <Text
              style={[styles.loanDescTxt, styles.loanDescTxtRefused, {fontSize: 15, lineHeight: 23, color: "#808080"}]}>
              您的还款正在处理中，请刷新查看状态
            </Text>
          </View>
        </View>
      </BoxShadow>
    </View>;

    /*评估已审核——有借款（未愈期)*/
    const RenderLoan = <View style={[styles.card]}>
      <BoxShadow setting={shadowOpt}>
        <View style={[styles.cardBody]}>
          <Text style={styles.loanTitle}>
            {title}
          </Text>
          <Text style={[styles.loanMoney]}>
            {money(amount)}
          </Text>
          <View style={[styles.loanDesc]}>
            <Text style={[styles.loanDescTxt]}>
              {desc}
            </Text>
          </View>

          {/*还款信息*/}
          <View style={styles.cardFooter}>
            <View style={styles.cardFooterLeft}>
              <Text style={styles.label}>还款日期</Text>
              <Text style={styles.value}>{moment(repayTime).format("YYYY.MM.DD")}</Text>
            </View>
            <View style={styles.cardFooterRight}>
              <Text style={styles.label}>距离还款日</Text>
              <Text style={styles.value}>{repayDay}天</Text>
            </View>
          </View>
        </View>
      </BoxShadow>
    </View>;

    /*逾期*/
    const RenderOverdue = <View style={styles.card}>
      <BoxShadow setting={shadowOpt}>
        <View style={styles.cardBody}>
          <Text style={styles.loanTitle}>
            {title}
          </Text>
          <Text style={[styles.loanMoney]}>
            {money(amount)}
          </Text>
          <View style={styles.loanDesc}>
            <Text style={[styles.loanDescTxt, {
              color: "#F63F53"
            }]}>
              {desc}
            </Text>
          </View>
          {/*还款信息*/}
          <View style={styles.cardFooter}>
            <View style={styles.cardFooterLeft}>
              <Text style={styles.label}>逾期天数</Text>
              <Text style={[styles.value, {color: '#FF604F'}]}>{overduedDay}天</Text>
            </View>
            <View style={styles.cardFooterRight}>
              <Text style={styles.label}>逾期罚息(元)</Text>
              <Text style={[styles.value, {color: '#FF604F'}]}>{money(overduedRate)}</Text>
            </View>
          </View>
        </View>
      </BoxShadow>
    </View>;


    /*按钮——蓝色可用*/
    const RnderBtnPrimary = <LinearButton
      onPress={() => {
        console.log('按钮点击');
        this.btnHandle();
      }}
      style={styles.btn}>
      <Text>{btnTxt}</Text>
    </LinearButton>;

    /*按钮——灰色不可用*/
    const RnderBtnDisabled = <View style={styles.btn}>
      <Button style={styles.btnDisabled}>{btnTxt}</Button>
    </View>;

    /*根据状态判断显示那个*/
    switch (statusc) {
      case "CREATED":
        RenderBody = RenderDefault;
        break;
      case "APPROVAL":
        RenderBody = RenderApproval;
        break;
      case "REFUSED":
        /*时间很短，其实就是实名认证之后的内容 */
        RenderBody = RenderRefused;
        break;
      case "USED":
        /*时间很短，其实就是实名认证之后的内容 */
        RenderBody = RenderLoan;
        break;
      case "REPAY":
        /*时间很短，其实就是实名认证之后的内容 */
        RenderBody = RenderRepay;
        break;

      case "OVERDUED":
        /*时间很短，其实就是实名认证之后的内容 */
        RenderBody = RenderOverdue;
        break;
    }


    return (
      <SafeAreaView style={styles.container}>
        {/*订阅事件*/}
        <NavigationEvents
          onDidFocus={payload => {
            // console.log("onDidFocus", payload, '首页');
            if (this.state.isLogin) {
              this.init();
            }

            // if (this.state.loaded) {
            //   this.init();
            // }
          }}
        />

        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
            />
          }
        >
          {/*顶部banner*/}
          <View style={styles.banner}>
            <Swiper
              showsButtons={false}
              paginationStyle={{
                bottom: 8
              }}
            >
              <View style={styles.swiperItem}>
                <Image style={styles.swiperImg} resizeMode={'cover'}
                       source={require("../../../assets/home/banner.png")}/>
              </View>
            </Swiper>
          </View>

          {/*卡片*/}
          {RenderBody}


          {/*按钮*/}
          <View style={{alignItems: 'center'}}>
            {btntype === "primary" ? RnderBtnPrimary : (statusc ? RnderBtnDisabled : null)}
          </View>

          {/*页脚*/}
          <View style={styles.footer}>
            <Image style={styles.footerIcon} resizeMode={'contain'} source={Images.home.Tips}/>
            <Text style={styles.footerText}>不向学生借款。</Text>
          </View>
        </ScrollView>

      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    flex: 1,
    backgroundColor: '#fff'
  },
  banner: {
    flex: 1,
    height: 144,
  },
  swiperItem: {
    flex: 1
  },
  swiperImg: {
    width,
  },
  /*卡片*/
  card: {
    flex: 1,
    height: 262,
    marginHorizontal: 15,
    marginTop: 30,
  },
  cardBody: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    backgroundColor: '#fff',
    paddingTop: 30,
    paddingHorizontal: 0
  },
  ingImg: {
    width: 191,
    height: 116,
    marginTop: 0,
    marginBottom: 30
  },
  /*卡片上面部分内容*/
  loanTitle: {
    fontSize: 16,
    textAlign: "center",
    color: "#1e1e1e"
  },
  loanMoney: {
    fontSize: 30,
    lineHeight: 34,
    marginTop: 20,
    marginBottom: 23,
    textAlign: "center",
    color: "#EB4542"
  },
  loanDesc: {
    width: 255,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderColor: "rgba(0,0,0,0.1)"
  },
  loanDescTxt: {
    fontSize: 12,
    textAlign: 'center',
    color: '#808080',
  },
  /*拒绝部分样式*/
  rImg: {
    width: 72,
    height: 72,
    marginBottom: 35
  },
  loanDescTxtRefused: {
    color: "#4C7BFE"
  },
  /*借款卡片*/
  loanCard: {
    height: 152,
    marginBottom: 10
  },
  /*账单卡片*/
  billCard: {
    height: 115,
    marginTop: 0
  },
  bLeft: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',

  },
  bLeftTitle: {
    fontSize: 15,
    color: "#1E1E1E",
    lineHeight: 22,
    marginBottom: 10,
  },
  bTime: {
    fontSize: 15,
    color: "#1E1E1E",
    lineHeight: 22,
    marginBottom: 5,
  },
  bFooter: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  bRemind: {
    fontSize: 12,
    color: "#808080",
    lineHeight: 17
  },
  bRemindText: {
    color: "#F63F53",
  },
  bRight: {
    width: 100,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-end'
  },
  bRightTitle: {
    fontSize: 15,
    color: "#808080",
    lineHeight: 22
  },
  bRightAmt: {
    fontSize: 26,
    color: "#4c7bfe",
    lineHeight: 30
  },
  /*按钮*/
  btn: {
    flex: 1,
    width: 300,
    borderRadius: 22,
    alignItems: 'center',
    marginTop: 30,
    height: 44
  },
  btnDisabled: {
    backgroundColor: "#D0D4DB",
    borderRadius: 22,
    color: "#FFFFFF"
  },


  /*三个小按钮图标*/
  loanFeature: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: 'center'
  },
  fItem: {
    flex: 1,
    flexDirection: "column",
    alignItems: 'center',
    justifyContent: 'center'
  },
  fImg: {
    width: 24,
    height: 24,
    marginBottom: 6
  },
  fText: {
    fontSize: 12,
    lineHeight: 17,
    color: 'rgba(51,51,51,1)'
  },
  /*页脚*/
  footer: {
    flex: 1,
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  footerIcon: {
    width: 8,
    height: 10,
    marginRight: 2
  },
  footerText: {
    fontSize: 10,
    color: "rgb(155,155,155)"
  },

  /*打款中*/
  Desc: {},
  cardFooter: {
    height: 96,
    flexDirection: 'row',
    alignItems: 'center'
  },
  cardFooterLeft: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardFooterRight: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  label: {
    marginBottom: 5,
    fontSize: 12,
    lineHeight: 17,
    color: "#808080"
  },
  value: {
    fontSize: 16,
    lineHeight: 22,
    color: "#1e1e1e"
  }
});
