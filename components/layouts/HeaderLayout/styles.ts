// components/layouts/HeaderLayout/styles.ts
import { StyleSheet } from 'react-native';

export const HEADER_LAYOUT_HEIGHT = 70;

const stylesHeaderLayout = StyleSheet.create({
  headerContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    height: HEADER_LAYOUT_HEIGHT,
    justifyContent: 'space-between',
    padding: 0,
  },
  iconPlaceholder: {
    alignItems: 'center',
    width: 55,
  },
  menuButton: {
    padding: 10,
  },
  settingsButton: {
    padding: 10,
  },
  title: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  childrenPadding: {
    padding: 0,
  },
});

export default stylesHeaderLayout;
