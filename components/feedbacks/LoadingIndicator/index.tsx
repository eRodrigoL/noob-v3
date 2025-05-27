// components/feedbacks/LoadingIndicator/index.tsx
import { images } from '@constants/images';
import { useTheme } from '@theme/index';
import { Image, Text, View } from 'react-native';
import stylesLoadingIndicator from './styles';

const LoadingIndicator = () => {
  const { fontSizes, fontFamily } = useTheme();

  return (
    <View style={stylesLoadingIndicator.container}>
      <Image source={images.loading} style={stylesLoadingIndicator.image} />
      <Text style={{ fontFamily, fontSize: fontSizes.base }}>Carregando jogos...</Text>
    </View>
  );
};

export default LoadingIndicator;
