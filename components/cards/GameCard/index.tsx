// components/cards/GameCard/index.tsx
import { images } from '@constants/images';
import { useTheme } from '@theme/index';
import { Image, Pressable, Text, View } from 'react-native';
import stylesGameCard from './styles';

interface GameCardProps {
  game: {
    id: string;
    nome: string;
    ano?: number;
    foto?: string;
    score: string;
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
        source={game.foto ? { uri: game.foto } : images.unavailable}
        style={stylesGameCard.image}
      />
      <View style={stylesGameCard.textContainer}>
        <Text
          style={[
            stylesGameCard.title,
            { color: colors.textOnBase, fontFamily, fontSize: fontSizes.base },
          ]}>
          {game.nome} {game.ano ? `(${game.ano})` : ''}
        </Text>
        <Text
          style={[
            stylesGameCard.score,
            { color: colors.backgroundHighlight, fontFamily, fontSize: fontSizes.small },
          ]}>
          {game.score}
        </Text>
      </View>
    </Pressable>
  );
};

export default GameCard;
