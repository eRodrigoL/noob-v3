import { logger } from '@lib/logger';
import { apiClient } from '@services/apiClient';
import styles from '@theme/themOld/globalStyle';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { storage } from '@store/storage';

const screenWidth = Dimensions.get('window').width;

// Componente principal
export default function Descricao() {
  // Estado para armazenar os dados do jogo ou usuário
  const { id } = useLocalSearchParams<{ id: string }>();
  const [game, setGame] = useState<any>(null);

  if (!id) {
    Toast.show({
      type: 'error',
      text1: 'Erro',
      text2: 'ID do jogo não encontrado.',
    });
    return;
  }

  // Hook useEffect para buscar os dados do jogo/usuário assim que o componente for montado
  useEffect(() => {
    fetchGameData();
  }, []);

  // Função para buscar dados do jogo/usuário na API
  const fetchGameData = async () => {
    try {
      // Recupera o ID do usuário e o token do AsyncStorage
      const userId = await storage.getItem('userId');
      const token = await storage.getItem('token');

      // Verifica se os dados foram encontrados
      if (!userId || !token) {
        // Alert.alert("Erro", "ID do usuário ou token não encontrados."); // Mostra um alerta se algo estiver ausente
        // return;
      }

      // Configura o cabeçalho da requisição com o token de autorização
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      // Faz uma requisição GET para a API usando o ID do usuário
      const response = await apiClient.get(`/jogos/${id}`, config);

      // Atualiza o estado com os dados recebidos
      setGame(response.data);
    } catch (error) {
      logger.error('Erro ao buscar os dados do usuário:', error);
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: 'Não foi possível carregar os dados do usuário.',
      });
    }
  };

  // Função para adicionar um dia a uma data e formatá-la
  const addOneDay = (dateString: string) => {
    const date = new Date(dateString);
    date.setDate(date.getDate() + 1);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }); // Retorna a data formatada no padrão brasileiro
  };

  // Enquanto os dados do jogo/usuário ainda não foram carregados, exibe um texto de "Carregando..."
  if (!game) {
    return <Text>Carregando...</Text>;
  }

  // Renderização do conteúdo principal quando os dados do jogo/usuário estão disponíveis
  return (
    <View style={localStyles.container}>
      <ScrollView style={{ flex: 1, width: screenWidth }}>
        {/* Idade */}
        <Text style={styles.customLabel}>Idade:</Text>
        <Text style={styles.label}>{game.idade}</Text>

        {/* Designer */}
        <Text style={styles.customLabel}>Designer:</Text>
        <Text style={styles.label}>{game.designer}</Text>

        {/* Editora */}
        <Text style={styles.customLabel}>Editora:</Text>
        <Text style={styles.label}>{game.editora}</Text>

        {/* Categoria */}
        <Text style={styles.customLabel}>Categoria:</Text>
        <Text style={styles.label}>{game.categoria}</Text>

        {/* Componentes */}
        <Text style={styles.customLabel}>Componentes:</Text>
        <Text style={styles.label}>{game.componentes}</Text>

        {/* Descrição */}
        <Text style={styles.customLabel}>Descrição:</Text>
        <Text style={styles.label}>{game.descricao}</Text>

        {/* Botão de Editar */}
        <View style={{ flex: 1, alignItems: 'center' }}>
          <TouchableOpacity
            style={styles.buttonPrimary}
            onPress={() => router.push(`/(legacy)/boardgameOld/EditGame?id=${id}`)}>
            <Text style={styles.buttonPrimaryText}>Editar Jogo</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
    width: screenWidth,
    minWidth: screenWidth,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
});
