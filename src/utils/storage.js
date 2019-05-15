import {AsyncStorage} from 'react-native'

const key = 'status';
export default class Storage {
  static getStatus(key,fn) {
    AsyncStorage.getItem(key, fn);
  }

  static setStatus(value, fn) {
    AsyncStorage.setItem(key, value, fn);
  }

  static async getValue(key) {
    return new Promise((resolve) => {
      AsyncStorage.getItem(key, (err, result) => {
        if (err) {
          console.log('读取storage出错', err);
          resolve(null);
          return;
        }
        if (result !== null) {
          result = JSON.parse(result);
        }
        resolve(result);
      });
    });
  }

  static async setValue(key, value) {
    value = JSON.stringify(value);
    return new Promise((resolve, reject) => {
      AsyncStorage.setItem(key, value, (err, result) => {
        if (err) reject(err)
        resolve(result);
      })
    });
  }

  static async removeValue(key) {
    return new Promise((resolve, reject) => {
      AsyncStorage.removeItem(key, (err, result) => {
        if (err) reject(err);
        resolve(result);
      });
    });
  }
}
