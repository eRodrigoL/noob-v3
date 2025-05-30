// app/(auth)/login/styles.ts
import { StyleSheet } from 'react-native';

const stylesLogin = StyleSheet.create({
  wrapperCenter: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  contentBox: {
    width: '100%',
    maxWidth: 480,
    padding: 16,
    borderRadius: 8,
  },
  linkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default stylesLogin;
