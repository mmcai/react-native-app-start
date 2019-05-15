import {Platform, StyleSheet} from 'react-native';

/**
 * Stack导航顶部样式
 * @type {{backgroundColor: string, elevation: number, borderBottomWidth: number, borderBottomColor: string, height: number}}
 */
export const StackNavigatorHeaderStyle = {
  backgroundColor: '#ffffff',
  elevation: 0,
  borderBottomWidth: StyleSheet.hairlineWidth,
  borderBottomColor: "#e0e0e0",
  height: (Platform.OS === 'android') ? 44 : 64
};
