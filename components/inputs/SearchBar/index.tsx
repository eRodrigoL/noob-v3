// components/SearchBar/index.tsx
import styles from '@theme/themOld/globalStyle'; // TODO: substituir por estilos locais no futuro
import React from 'react';
import { TextInput } from 'react-native';

interface SearchBarProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ placeholder, value, onChangeText }) => {
  return (
    <TextInput
      style={styles.searchBar}
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      placeholderTextColor="#999"
      accessible
      accessibilityLabel="Campo de busca de jogos"
      accessibilityHint="Digite o nome do jogo que deseja encontrar"
    />
  );
};

export default SearchBar;

