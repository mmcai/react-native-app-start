## 介绍
基于React-Native框架开发APP应用，项目当中使用的第三方框架有react-navigation，dva（基于redux和redux-saga）等。


## 如何使用
第一步：下载项目所需要的包
```
npm install
```

第二步：把安卓模拟器打开并运行起来

第三步：在项目根目录直接运行如下命令
```
react-native run-android
```
在第三步的时候，你会发现，你不能把项目跑起来，你认真看下错误代码就能明白是什么原因。它的意思是，我们安装的第三方包需要的编译运行环境找不到，也就是说，这个包太老了，我们需要稍微修改下这个包当中的build.gradle当中的一些内容。如果修改SDK版本，您可以参考/android/app/build.gradle 这个文件当中配置的内容。如果实在不行，可以私聊我。


## 常用命令

模拟器上运行您的项目，除非您的项目当中引用了基于原生的包，否则，你下次运行的时候，可以直接使用下面一条命令
```
react-native run-android
```

如果您的模拟器上，已经安装了安装测试包，直接运行如下代码就可以了，该命令不会再次在模拟器上重新安装APK包
```
react-native start
```

生成发行的APK包，在/android/app/build/output/apk/release 文件夹下面
```
$ cd android
$ ./gradlew assembleRelease
```

生成签名密钥
```
keytool -genkeypair -v -keystore <my-release-key.keystore> -alias <my-key-alias> -keyalg RSA -keysize 2048 -validity 10000
```
一个demo

## 其它
如果项目成功跑起来了，登陆页面的手机号和验证码随便输入就行
这里的接口是使用easy-mock 自己模拟的，很多接口涉及到业务逻辑，我没有实现，可能您没办法完全体验项目，请见谅，如果您想体验已经上线的版本，您可以私聊我，我给你发线上的连接，最后祝您生活愉快，好运！