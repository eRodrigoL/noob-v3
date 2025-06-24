// components/buttons/ButtonHighlight/index.tsx

import { useTheme } from '@hooks/useTheme';
import globalStyles from '@theme/global/globalStyles';
import React, { useState } from 'react';
import { AccessibilityProps, Pressable, StyleProp, Text, TextStyle, ViewStyle } from 'react-native';

interface ButtonHighlightProps extends AccessibilityProps {
  title: string;                     
  onPress: () => void;                
  disabled?: boolean;                 
  fontFamilyOverride?: string;        
  fontSizeOverride?: number;          
  colorOverride?: string;             
  backgroundColorOverride?: string;  
  style?: StyleProp<ViewStyle>;       // Permite passar estilos adicionais para o botão (opcional)
  textStyle?: StyleProp<TextStyle>;   // Permite passar estilos adicionais para o texto (opcional)
}

const ButtonHighlight: React.FC<ButtonHighlightProps> = ({
  title,
  onPress,
  disabled = false,
  fontFamilyOverride,
  fontSizeOverride,
  colorOverride,
  backgroundColorOverride,
  accessibilityLabel,
  accessibilityHint,
  accessibilityRole = 'button',
  style,
  textStyle,
  ...rest
}) => {
  const { colors, fontFamily, fontSizes } = useTheme();

  // Adicionei este estado para controlar se o mouse está sobre o botão no web.
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      onHoverIn={() => setIsHovered(true)} // Detecta quando o mouse entra no botão no web.
      onHoverOut={() => setIsHovered(false)} // Detecta quando o mouse sai do botão no web.
      accessibilityLabel={accessibilityLabel ?? title}
      accessibilityHint={accessibilityHint}
      accessibilityRole={accessibilityRole}
      accessible
      disabled={disabled}
      {...rest}
      style={({ pressed }) => [
        globalStyles.button,
        style,
        {
          // Alterei esta parte para mudar a cor do botão quando o mouse passa em cima dele.
          backgroundColor: disabled
            ? colors.backgroundHighlight
            : isHovered
            ? darkenColor(colors.backgroundHighlight, 0.15) // Escurece a cor do botão no hover.
            : backgroundColorOverride || colors.backgroundHighlight,
          opacity: disabled ? 0.4 : pressed ? 0.8 : 1,
        },
      ]}
    >
      <Text
        style={[
          globalStyles.textCenteredBold,
          textStyle,
          {
            fontFamily: fontFamilyOverride || fontFamily,
            fontSize: fontSizeOverride || fontSizes.base,
            color: colorOverride || colors.textOnHighlight,
          },
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );
};

// Adicionei esta função auxiliar para escurecer a cor do botão no hover.
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

export default ButtonHighlight;

/*
Este código implementa um efeito visual quando o usuário passa o mouse no botão (hover).
Funciona no Web e Mobile
Usa o tema dinâmico e seus estilos globais
*/