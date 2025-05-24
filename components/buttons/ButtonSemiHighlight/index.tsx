// components/buttons/ButtonSemiHighlight/index.tsx
import { useTheme } from '@hooks/useTheme';
import globalStyles from '@theme/global/globalStyles';
import React from 'react';
import { Pressable, Text } from 'react-native';

interface ButtonSemiHighlightProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  fontFamilyOverride?: string;
  fontSizeOverride?: number;
  colorOverride?: string;
  backgroundColorOverride?: string;
}

const ButtonSemiHighlight: React.FC<ButtonSemiHighlightProps> = ({
  title,
  onPress,
  disabled = false,
  fontFamilyOverride,
  fontSizeOverride,
  colorOverride,
  backgroundColorOverride,
}) => {
  const { colors, fontFamily, fontSizes } = useTheme();

  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      style={({ pressed }) => [
        globalStyles.button,
        {
          backgroundColor: backgroundColorOverride || colors.backgroundSemiHighlight,
          opacity: disabled ? 0.4 : pressed ? 0.8 : 1, // Efeito de toque leve
        },
      ]}>
      <Text
        style={[
          globalStyles.textCenteredBold,
          {
            fontFamily: fontFamilyOverride || fontFamily,
            fontSize: fontSizeOverride || fontSizes.base,
            color: colorOverride || colors.textOnSemiHighlight,
          },
        ]}>
        {title}
      </Text>
    </Pressable>
  );
};

export default ButtonSemiHighlight;
