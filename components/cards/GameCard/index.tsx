// components/cards/GameCard/index.tsx
import { images } from '@constants/images';
import { useTheme } from '@theme/index';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Image, LayoutChangeEvent, Platform, Pressable, Text, View } from 'react-native';
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
  const scrollAnim = useRef(new Animated.Value(0)).current;
  const textContainerRef = useRef<View>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [textWidth, setTextWidth] = useState(0);
  const [shouldAnimate, setShouldAnimate] = useState(false);

  const fullTitle = `${game.nome}${game.ano ? ` (${game.ano})` : ''}`;

  useEffect(() => {
    if (shouldAnimate && textWidth > containerWidth) {
      scrollAnim.setValue(0);
      Animated.loop(
        Animated.sequence([
          Animated.delay(1200),
          Animated.timing(scrollAnim, {
            toValue: -(textWidth - containerWidth),
            duration: 5000,
            useNativeDriver: Platform.OS !== 'web',
          }),
          Animated.delay(1000),
          Animated.timing(scrollAnim, {
            toValue: 0,
            duration: 5000,
            useNativeDriver: Platform.OS !== 'web',
          }),
        ])
      ).start();
    }
  }, [shouldAnimate, textWidth, containerWidth]);

  const handleContainerLayout = (e: LayoutChangeEvent) => {
    setContainerWidth(e.nativeEvent.layout.width);
  };

  const handleTextLayout = (e: LayoutChangeEvent) => {
    setTextWidth(e.nativeEvent.layout.width);
    setShouldAnimate(e.nativeEvent.layout.width > containerWidth);
  };

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        stylesGameCard.card,
        { backgroundColor: colors.backgroundHighlight, opacity: pressed ? 0.9 : 1 },
        style,
      ]}>
      <View
        style={[
          stylesGameCard.imageContainer,
          { backgroundColor: colors.backgroundSemiHighlight },
        ]}>
        <Image
          source={game.foto ? { uri: game.foto } : images.unavailable}
          style={stylesGameCard.image}
        />
      </View>

      <View style={stylesGameCard.textContainer}>
        <View
          onLayout={handleContainerLayout}
          style={{
            width: '100%',
            height: fontSizes.base * 1.5,
            overflow: 'hidden',
            alignItems: 'flex-start',
          }}>
          <Animated.View
            ref={textContainerRef}
            onLayout={handleTextLayout}
            style={{
              transform: shouldAnimate ? [{ translateX: scrollAnim }] : [],
            }}>
            <Text
              numberOfLines={1}
              style={{
                fontSize: fontSizes.base,
                fontFamily,
                color: colors.textOnHighlight,
              }}>
              {fullTitle}
            </Text>
          </Animated.View>
        </View>

        <Text
          style={{
            color: colors.textOnHighlight,
            fontFamily,
            fontSize: fontSizes.small,
            textAlign: 'center',
            fontStyle: 'italic',
            marginTop: 4,
          }}>
          {game.score}
        </Text>
      </View>
    </Pressable>
  );
};

export default GameCard;
