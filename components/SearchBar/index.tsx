// components/SearchBar/index.tsx
import React from 'react';
import { TextInput } from 'react-native';
import styles from './Default'; // TODO: substituir por estilos locais no futuro

// TODO: usar logger se necessário para debug

interface SearchBarProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ placeholder, value, onChangeText }) => {
  return (
    <TextInput
      style={styles.searchBar} // TODO: extrair para styles.ts ou aplicar tema com useTheme
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      placeholderTextColor="#999" // TODO: adaptar dinamicamente com tema
    />
  );
};

export default SearchBar;
