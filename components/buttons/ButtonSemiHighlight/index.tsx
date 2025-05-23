// components/buttons/ButtonSemiHighlight/index.tsx
import { useTheme } from '@hooks/useTheme';
import globalStyles from '@theme/global/globalStyles';
import React from 'react';
import { Pressable, Text } from 'react-native';

interface ButtonSemiHighlightProps {
  title: string;
  onPress: () => void;
  fontFamilyOverride?: string;
  fontSizeOverride?: number;
  colorOverride?: string;
  backgroundColorOverride?: string;
}

const ButtonSemiHighlight: React.FC<ButtonSemiHighlightProps> = ({
  title,
  onPress,
  fontFamilyOverride,
  fontSizeOverride,
  colorOverride,
  backgroundColorOverride,
}) => {
  const { colors, fontFamily, fontSizes } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        globalStyles.button,
        {
          backgroundColor: backgroundColorOverride || colors.backgroundSemiHighlight,
          opacity: pressed ? 0.85 : 1, // Efeito de toque leve
        },
      ]}>
      <Text
        style={[
          globalStyles.textCentered,
          {
            fontFamily: fontFamilyOverride || fontFamily,
            fontSize: fontSizeOverride || fontSizes.base,
            color: colorOverride || colors.textOnHighlight,
          },
        ]}>
        {title}
      </Text>
    </Pressable>
  );
};

export default ButtonSemiHighlight;
