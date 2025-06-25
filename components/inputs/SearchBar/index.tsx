// components/SearchBar/index.tsx
import { globalStyles, useTheme } from '@theme/index';
import React from 'react';
import { TextInput } from 'react-native';

interface SearchBarProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ placeholder, value, onChangeText }) => {
  const { colors, fontFamily, fontSizes } = useTheme();
  return (
    <TextInput
      style={[
        globalStyles.input,
        {
          color: colors.textOnBase,
          fontFamily,
          fontSize: fontSizes.base,
          borderWidth: 1,
          borderColor: colors.textOnBase,
        },
      ]}
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      placeholderTextColor={colors.textOnBase}
      accessible
      accessibilityLabel="Campo de busca de jogos"
      accessibilityHint="Digite o nome do jogo que deseja encontrar"
    />
  );
};

export default SearchBar;
