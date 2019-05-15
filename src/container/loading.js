import React from 'react'
import {StyleSheet, View, ActivityIndicator} from 'react-native'

const Loading = () => (
  <View style={styles.container}>
    <ActivityIndicator/>
    <ActivityIndicator size="large" color="#0000ff" />
    <ActivityIndicator size="small" color="#00ff00" />
    <ActivityIndicator size="large" color="#0000ff" />
    <ActivityIndicator size="small" color="#00ff00" />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "rgba(255,255,255,0.7)"
  },
});

export default Loading;
