// components/Splash/index.tsx

// Importa as bibliotecas necessárias do React e React Native
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

// Componente funcional que exibe uma tela de carregamento
const Loading = () => {
  return (
    // Exibe a View principal contendo o indicador de carregamento e o texto
    <View style={styles.container}>
      {/* Componente ActivityIndicator mostra uma animação de carregamento */}
      <ActivityIndicator size="large" color="#0000ff" />
      {/* Exibe um texto abaixo do indicador de carregamento */}
      <Text style={styles.text}>Carregando...</Text>
    </View>
  );
};

// Estilos para o layout e aparência do componente
const styles = StyleSheet.create({
  // Estilo para a View principal: ocupa toda a tela e centraliza os itens
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Estilo para o texto: adiciona uma margem acima e define o tamanho da fonte
  text: {
    marginTop: 10,
    fontSize: 18,
  },
});

// Exporta o componente Loading para ser usado em outras partes do aplicativo
export default Loading;
