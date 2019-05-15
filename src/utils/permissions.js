import {AsyncStorage, PermissionsAndroid} from 'react-native';


export default class Permissions {

  /*检查某项权限*/
  static async check(key) {
    const CheckResult = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS[key]);
    return !!CheckResult;
  }

  /*请求单个权限*/
  static async get(key) {
    return await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS[key]
    );
  }

  /*请求多个权限*/
  static async getMultiple(key) {
    const params = [];
    key.forEach((item, index) => {
      params[index] = `PermissionsAndroid.PERMISSIONS.${item}`;
    });

    return await PermissionsAndroid.requestMultiple(params);
  }
}
