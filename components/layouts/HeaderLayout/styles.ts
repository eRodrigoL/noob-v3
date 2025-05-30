// components/layouts/HeaderLayout/styles.ts
import { StyleSheet } from 'react-native';

const stylesHeaderLayout = StyleSheet.create({
  headerContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 70,
    justifyContent: 'space-between',
    padding: 0,
    zIndex: 1,
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
    paddingHorizontal: 16,
    paddingTop: 16,
  },
});

export default stylesHeaderLayout;
