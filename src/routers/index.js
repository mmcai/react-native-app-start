import React, {PureComponent} from 'react'
import {BackHandler, Image, NetInfo, Alert, View} from 'react-native'
import {createStackNavigator, createSwitchNavigator, NavigationActions, SafeAreaView} from 'react-navigation'
import {
  createNavigationReducer,
  createReactNavigationReduxMiddleware,
  reduxifyNavigator,
} from 'react-navigation-redux-helpers'
import {connect} from 'react-redux'
import Router from '../Router';
import Navigator from '../Navigation';
import {StackNavigatorHeaderStyle} from "../common/style";
import {Images} from "../common/images";
import VersionNumber from 'react-native-version-number';
import SplashScreen from "react-native-splash-screen";
import {Permissions, Storage, Toast} from "../utils";
import CodePush from "react-native-code-push";

/*热更新的配置文件*/
let codePushOptions = {
  //设置检查更新的频率
  //ON_APP_RESUME APP恢复到前台的时候
  //ON_APP_START APP开启的时候
  //    手动检查
  checkFrequency: CodePush.CheckFrequency.ON_APP_RESUME
};

/*路由配置*/
const AppNavigator = createStackNavigator(Navigator, {
  headerMode: 'screen', // 页面模式
  initialRouteName: Router.MAIN, //路由首页
  navigationOptions: () => {
    return ({
      headerStyle: StackNavigatorHeaderStyle,
      headerBackImage: <Image style={{marginLeft: 10, width: 17, height: 17}} source={Images.common.PinLeft}/>,
      titleStyle: {
        textAlign: 'center',
      },
      headerTitleStyle: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        alignSelf: 'center',
        fontSize: 16,
        color: "#1e1e1e",
        fontWeight: 'normal',
        textAlign: 'center',
      },
      headerRight: <View style={[{minWidth: 40, paddingRight: 10}]}/>,
      headerBackTitle: null
    })
  }
});

AppNavigator.navigationOptions = ({navigation}) => {
  const {routeName} = navigation.state.routes[navigation.state.index];
  return {headerTitle: routeName}
};

export const routerReducer = createNavigationReducer(AppNavigator);

export const routerMiddleware = createReactNavigationReduxMiddleware(
  'root',
  state => state.router
);

const App = reduxifyNavigator(AppNavigator, 'root');

@connect(({app, router, loading}) => ({app, router, loading}))
class RouterDva extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: true,
      immediateUpdate: false,
      permissions: true,
      isConnected: null,
      connectionInfo: null
    };
  }

  codePushStatusDidChange(syncStatus) {
    if (this.state.immediateUpdate) {
      switch (syncStatus) {
        case CodePush.SyncStatus.CHECKING_FOR_UPDATE:
          this.syncMessage = 'Checking for update'
          break;
        case CodePush.SyncStatus.DOWNLOADING_PACKAGE:
          this.syncMessage = 'Downloading package';

          Alert.alert(
            '',
            '正在下载更新包，请稍后....',
            [],
            {cancelable: false}
          );

          break;
        case CodePush.SyncStatus.AWAITING_USER_ACTION:
          this.syncMessage = 'Awaiting user action'
          break;
        case CodePush.SyncStatus.INSTALLING_UPDATE:
          this.syncMessage = 'Installing update'

          break;
        case CodePush.SyncStatus.UP_TO_DATE:
          this.syncMessage = 'App up to date.'
          break;
        case CodePush.SyncStatus.UPDATE_IGNORED:
          this.syncMessage = 'Update cancelled by user'
          break;
        case CodePush.SyncStatus.UPDATE_INSTALLED:

          Alert.alert(
            '',
            '更新完成，点击确定重启',
            [
              {
                text: '立即重启',
                onPress: () => {
                  CodePush.allowRestart();
                }
              }
            ],
            {cancelable: false}
          );

          this.syncMessage = 'Update installed and will be applied on restart.'
          break;
        case CodePush.SyncStatus.UNKNOWN_ERROR:
          this.syncMessage = 'An unknown error occurred'
          break;
      }
    }
  }

  codePushDownloadDidProgress(progress) {
    if (this.state.immediateUpdate) {
      this.currProgress = parseFloat(progress.receivedBytes / progress.totalBytes).toFixed(2)
      if (this.currProgress >= 1) {

        console.log("下载完成");
      }
    }
  }

  //如果有更新的提示
  syncImmediate() {
    this.setState({immediateUpdate: true});

    CodePush.sync({
        //安装模式
        //ON_NEXT_RESUME 下次恢复到前台时
        //ON_NEXT_RESTART 下一次重启时
        //IMMEDIATE 马上更新
        installMode: CodePush.InstallMode.IMMEDIATE,
        // Staging : L8qmIxzKE6h1Wsl2CKEKgL1UxHyu8ac6a78b-de9c-4a29-b2a0-b35ff8036ed4
        // Product ：wx8P8vfeTMMEZZUBbz5X_njGALz18ac6a78b-de9c-4a29-b2a0-b35ff8036ed4


        deploymentKey: "L8qmIxzKE6h1Wsl2CKEKgL1UxHyu8ac6a78b-de9c-4a29-b2a0-b35ff8036ed4",
        //对话框
        updateDialog: {
          //是否显示更新描述
          appendReleaseDescription: false,
          //更新描述的前缀。 默认为"Description"
          descriptionPrefix: "更新内容:",
          //强制更新按钮文字，默认为continue
          mandatoryContinueButtonLabel: "立即更新",
          //强制更新时的信息. 默认为"An update is available that must be installed."
          mandatoryUpdateMessage: "发现新版本，您需要更新后才能使用",
          //非强制更新时，按钮文字,默认为"ignore"
          optionalIgnoreButtonLabel: '稍后',
          //非强制更新时，确认按钮文字. 默认为"Install"
          optionalInstallButtonLabel: '更新',
          //非强制更新时，检查到更新的消息文本
          optionalUpdateMessage: '有新版本了，是否更新？',
          //Alert窗口的标题
          title: '版本更新'
        },
      },
      this.codePushStatusDidChange.bind(this),
      this.codePushDownloadDidProgress.bind(this)
    );
  }

  componentWillMount() {
    SplashScreen.hide();
    BackHandler.addEventListener('hardwareBackPress', this.backHandle);
    const self = this;
    /*授权访问权限*/
    this.checkCameraPermission();

    /*热更新*/
    CodePush.disallowRestart();//禁止重启

    self.syncImmediate();
  }


  async GetPermission() {
    const flagCamera = await Permissions.check('CAMERA');
    const flagStorage = await Permissions.check('READ_EXTERNAL_STORAGE');
    const flagContact = await Permissions.check('READ_CONTACTS');
    if (!flagCamera || !flagContact || !flagStorage) {
      Permissions.getMultiple(['CAMERA', 'READ_EXTERNAL_STORAGE', 'READ_CONTACTS']).then((res) => {
        console.log(res, '授权');

        for (let k in res) {
          switch (res[k]) {
            case "denied":
            case "never_ask_again":
              this.setState({
                permissions: false
              });
              break;
            case "granted":
              this.setState({
                permissions: true
              });
              break;
          }
        }

      })
    }

    //请求通讯录
    // this.checkContactPermission();
  }

  async checkCameraPermission() {
    const flag = await Permissions.check('CAMERA');
    console.log(flag, '权限校验');
    if (!flag) {
      Permissions.get('CAMERA').then((res) => {
        switch (res) {
          case "denied":
          case "never_ask_again":
            this.setState({
              permissions: false
            });
            break;
          case "granted":
            console.log('授权成功');
            this.setState({
              permissions: true
            });
            break;
        }


        this.checkContactPermission();
      })
    }
  }

  async checkContactPermission() {
    const flag = await Permissions.check('READ_CONTACTS');
    if (!flag) {
      Permissions.get('READ_CONTACTS').then((res) => {
        switch (res) {
          case "denied":
          case "never_ask_again":
            this.setState({
              permissions: false
            });
            break;
          case "granted":
            console.log('授权成功');
            this.setState({
              permissions: true
            });
            break;
        }

        this.checkFilePermission();
      })
    }
  }


  async checkFilePermission() {
    const flag = await Permissions.check('READ_EXTERNAL_STORAGE');
    if (!flag) {
      Permissions.get('READ_EXTERNAL_STORAGE').then((res) => {
        switch (res) {
          case "denied":
          case "never_ask_again":
            this.setState({
              permissions: false
            });
            break;
          case "granted":
            console.log('授权成功');
            this.setState({
              permissions: true
            });
            break;
        }
      })
    }
  }

  /*网络请求判断*/
  CheckInternet() {
    //检测网络是否连接
    NetInfo.isConnected.fetch().done((isConnected) => {
      this.setState({isConnected});
    });

    //检测网络连接信息
    NetInfo.getConnectionInfo().done((connectionInfo) => {
      this.setState({connectionInfo});
    });

    //监听网络变化事件
    NetInfo.addEventListener('connectionChange', (networkType) => {
      this.setState({isConnected: networkType})
    })
  }

  componentDidMount() {
    this.CheckInternet();



    // Storage.removeValue('token');
  }

  componentDidUpdate(props, state) {
    if (state.isConnected !== null && !state.isConnected) {
      Toast.show('网络不太给力，请稍后再试');
    }
    //console.log(state, 'update');
    if (!state.permissions) {
      Alert.alert(
        '温馨提示',
        '金银花需要您授权存储，相机，文件存储权限才能继续使用,请到应用设置里面打开相关权限',
        [
          {
            text: '好的', onPress: () => {
              BackHandler.exitApp();
            }
          },
        ],
        {cancelable: false}
      )
    }
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.backHandle);
  }

  backHandle = () => {
    const {dispatch, router} = this.props;
    console.log('返回事件', router);
    if (router.index === 0) {
      if (router.routes[0].index === 0) {
        // if (this.lastBackPressed && this.lastBackPressed + 2000 >= Date.now()) {
        //   BackHandler.exitApp();
        //   // return false;
        // }
        // this.lastBackPressed = Date.now();
        // Toast.show('再按一次回到桌面');

        BackHandler.exitApp();
        return false;
      } else {
        dispatch(NavigationActions.back());
        return true;
      }
    }

    dispatch(NavigationActions.back());
    return true;
  };

  render() {
    const {dispatch, router} = this.props;
    return <App dispatch={dispatch} state={router}>

    </App>;
  }
}

RouterDva = CodePush(codePushOptions)(RouterDva);

export default RouterDva;
