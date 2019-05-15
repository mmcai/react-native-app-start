import React from 'react';
import {ScrollView, View, StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-navigation';

const Page = ({children, ...rest}) => {
  return (
    <View style={styles.page}>
      <ScrollView style={styles.body}>
        <View {...rest}>{children}</View>
      </ScrollView>e
    </View>
  )
};


const styles = StyleSheet.create({
  page: {
    flex: 1
  },
  body: {
    flex: 1
  }
});

export default Page;
