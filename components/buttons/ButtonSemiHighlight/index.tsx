// components/buttons/ButtonSemiHighlight/index.tsx
import { useTheme } from '@hooks/useTheme';
import globalStyles from '@theme/global/globalStyles';
import React from 'react';
import { Pressable, Text, AccessibilityProps } from 'react-native';

interface ButtonSemiHighlightProps extends AccessibilityProps {
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
  accessibilityLabel,
  accessibilityHint,
  accessibilityRole = 'button', // padrão para botões
  ...rest
}) => {
  const { colors, fontFamily, fontSizes } = useTheme();

  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      accessible
      accessibilityLabel={accessibilityLabel ?? title}
      accessibilityHint={accessibilityHint}
      accessibilityRole={accessibilityRole}
      disabled={disabled}
      {...rest}
      style={({ pressed }) => [
        globalStyles.button,
        {
          backgroundColor: backgroundColorOverride || colors.backgroundSemiHighlight,
          opacity: disabled ? 0.4 : pressed ? 0.8 : 1,
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
