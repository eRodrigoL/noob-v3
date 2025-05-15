// components/BottonGoBack/index.tsx
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Theme } from './Theme';

const ButtonGoBack: React.FC = () => {
  const router = useRouter();

  // Função para voltar à tela anterior
  const goBack = () => {
    router.back();
  };

  return (
    <TouchableOpacity onPress={goBack} style={styles.button}>
      <Text style={styles.buttonText}>X</Text>
    </TouchableOpacity>
  );
};

export default ButtonGoBack;

// Estilos para o componente
const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    top: 20, // Ajuste conforme necessário
    right: 20, // Ajuste conforme necessário
    backgroundColor: 'transparent', // Fundo transparente
    padding: 10, // Espaçamento interno
  },
  buttonText: {
    fontSize: 24, // Tamanho do texto
    color: Theme.light.link, // Texto laranja
    fontWeight: 'bold', // Estilo do texto
  },
});
