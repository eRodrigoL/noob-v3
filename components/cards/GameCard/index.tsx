// components/cards/GameCard/index.tsx
import { images } from '@constants/images';
import { useTheme } from '@theme/index';
import { Image, Pressable, Text, View } from 'react-native';
import stylesGameCard from './styles';

interface GameCardProps {
  game: {
    id: string;
    titulo: string;
    ano?: number;
    capa?: string;
    rating: string;
  };
  onPress?: () => void;
  style?: object;
}

const GameCard = ({ game, onPress, style }: GameCardProps) => {
  const { colors, fontSizes, fontFamily } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        stylesGameCard.card,
        { backgroundColor: colors.backgroundSemiHighlight, opacity: pressed ? 0.9 : 1 },
        style,
      ]}>
      <Image
        source={game.capa ? { uri: game.capa } : images.unavailable}
        style={stylesGameCard.image}
      />
      <View style={stylesGameCard.textContainer}>
        <Text
          style={[
            stylesGameCard.title,
            { color: colors.textOnBase, fontFamily, fontSize: fontSizes.base },
          ]}>
          {game.titulo} {game.ano ? `(${game.ano})` : ''}
        </Text>
        <Text
          style={[
            stylesGameCard.rating,
            { color: colors.border, fontFamily, fontSize: fontSizes.small },
          ]}>
          {game.rating}
        </Text>
      </View>
    </Pressable>
  );
};

export default GameCard;
