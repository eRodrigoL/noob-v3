// components/feedbacks/LoadingIndicator/styles.ts
import { StyleSheet } from 'react-native';

const stylesLoadingIndicator = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    marginBottom: 20,
  },
});

export default stylesLoadingIndicator;
