import React from 'react'
import {AppRegistry} from 'react-native'

import dva from './dva'
import Router, {routerMiddleware, routerReducer} from './routers'
import {name as appName} from '../app.json';
import Models from './models/models'
import {Toast} from "./utils";

const app = dva({
  initialState: {},
  models: [...Models],
  extraReducers: {router: routerReducer},
  onAction: [routerMiddleware],
  onError: (e) => {
    e.preventDefault();
    Toast.show(e.message);
    console.log('onError', e)
  }
});


const App = app.start(<Router/>);
AppRegistry.registerComponent(appName, () => App);
