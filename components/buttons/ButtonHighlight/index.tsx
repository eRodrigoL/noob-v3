// components/buttons/ButtonHighlight/index.tsx
import { useTheme } from '@hooks/useTheme';
import globalStyles from '@theme/global/globalStyles';
import React from 'react';
import { Pressable, Text } from 'react-native';

interface ButtonHighlightProps {
  title: string;
  onPress: () => void;
  fontFamilyOverride?: string;
  fontSizeOverride?: number;
  colorOverride?: string;
  backgroundColorOverride?: string;
}

const ButtonHighlight: React.FC<ButtonHighlightProps> = ({
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
          backgroundColor: backgroundColorOverride || colors.backgroundHighlight,
          opacity: pressed ? 0.8 : 1, // efeito visual ao pressionar
        },
      ]}>
      <Text
        style={[
          globalStyles.textCenteredBold,
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

export default ButtonHighlight;
