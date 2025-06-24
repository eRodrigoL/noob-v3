// components/buttons/ButtonSemiHighlight/index.tsx
import { useTheme } from '@hooks/useTheme';
import globalStyles from '@theme/global/globalStyles';
import React, { useState } from 'react'; // adicionei useState para controlar hover no web
import { AccessibilityProps, Platform, Pressable, Text } from 'react-native'; // importei Platform para diferenciar web e mobile

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

  const [isHovered, setIsHovered] = useState(false); // controle do hover para web
 
  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      accessible
      accessibilityLabel={accessibilityLabel ?? title}
      accessibilityHint={accessibilityHint}
      accessibilityRole={accessibilityRole}
      disabled={disabled}
      {...rest}

      onHoverIn={() => Platform.OS === 'web' && setIsHovered(true)} // detecta quando o mouse entra no botão (só web)
      onHoverOut={() => Platform.OS === 'web' && setIsHovered(false)} // detecta quando o mouse sai do botão (só web)
      
      style={({ pressed }) => [
        globalStyles.button,
        {
          backgroundColor: disabled
            ? (backgroundColorOverride || colors.backgroundSemiHighlight)
            : isHovered
            ? darkenColor(backgroundColorOverride || colors.backgroundSemiHighlight, 0.15) // escurece a cor no hover web
            : backgroundColorOverride || colors.backgroundSemiHighlight,
          opacity: disabled ? 0.4 : pressed ? 0.8 : 1, // efeito no toque mobile
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

// Função para escurecer cor "HEX" (usada para hover na web)
function darkenColor(color: string, amount: number): string {
  let col = color.replace('#', '');
  let num = parseInt(col, 16);
  let r = (num >> 16) & 0xff;
  let g = (num >> 8) & 0xff;
  let b = num & 0xff;
  r = Math.max(0, Math.min(255, Math.floor(r * (1 - amount))));
  g = Math.max(0, Math.min(255, Math.floor(g * (1 - amount))));
  b = Math.max(0, Math.min(255, Math.floor(b * (1 - amount))));
  const rr = r.toString(16).padStart(2, '0');
  const gg = g.toString(16).padStart(2, '0');
  const bb = b.toString(16).padStart(2, '0');
  return `#${rr}${gg}${bb}`;
}
export default ButtonSemiHighlight;
