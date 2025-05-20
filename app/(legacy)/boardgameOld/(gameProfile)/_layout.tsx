import Header from '@components/Header';
import { images } from '@constants/images';
import { Ionicons } from '@expo/vector-icons';
import { getImageSource } from '@lib/getImageSource';
import { logger } from '@lib/logger';
import { apiClient } from '@services/apiClient';
import styles from '@theme/themOld/globalStyle';
import { Theme } from '@theme/themOld/theme';
import { Tabs, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';
import Toast from 'react-native-toast-message';

const { height: screenHeight, width: screenWidth } = Dimensions.get('window');

// Define o tipo para os dados do jogo
interface Game {
  id?: string | null;
  foto?: string | null;
  capa?: string | null;
  titulo?: string | null;
  ano?: string | null; // Ajustado para string, conforme o modelo da API
  idade?: number | null;
  designer?: string | null;
  artista?: string | null;
  editora?: string | null;
  descricao?: string | null;
}

const GameProfile: React.FC = () => {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedGame, seteditedGame] = useState<any>(null);

  // Função para buscar os dados do jogo
  const fetchGameData = async () => {
    try {
      if (!id) {
        Toast.show({
          type: 'error',
          text1: 'Erro',
          text2: 'ID do jogo não encontrados.',
        });
        return;
      }

      const response = await apiClient.get(`/jogos/${id}`);

      setGame(response.data);
      seteditedGame(response.data);
    } catch (error) {
      logger.error('Erro ao buscar os dados do jogo:', error);
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: 'Não foi possível carregar os dados do jogo.',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGameData();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Carregando dados do jogo...</Text>
      </View>
    );
  }

  if (!game) {
    return (
      <View style={styles.container}>
        <Text>Erro ao carregar os dados do jogo.</Text>
      </View>
    );
  }

  const addOneDay = (dateString: string) => {
    const date = new Date(dateString);
    date.setDate(date.getDate() + 1); // Adiciona 1 dia
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <View style={{ flex: 1 }}>
      <Header title="Jogo" />

      {/* Container da foto, nome e ano*/}
      <View style={localStyles.header}>
        <View style={localStyles.fotoContainer}>
          {/* Local da foto*/}
          <Image
            source={getImageSource(game.capa ?? null, images.unavailable)}
            style={localStyles.foto}
          />
        </View>

        {/* Local do nome */}
        <Text style={localStyles.headerTitle}>
          {game.titulo} {game.ano}
        </Text>
      </View>

      <View style={localStyles.bodyContainer}>
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarStyle: localStyles.tabBar,
            tabBarActiveTintColor: '#000',
            tabBarInactiveTintColor: '#8E8E93',
          }}>
          <Tabs.Screen
            name="Descricao"
            options={{
              title: 'Descrição',
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="dice-outline" size={size} color={color} />
              ),
            }}
            initialParams={{ id: id }}
          />
          <Tabs.Screen
            name="Analises"
            options={{
              title: 'Análises',
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="stats-chart-outline" size={size} color={color} />
              ),
            }}
            initialParams={{ id: id }}
          />
          <Tabs.Screen
            name="Classificacao"
            options={{
              title: 'Classificação',
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="trophy-outline" size={size} color={color} />
              ),
            }}
            initialParams={{ id: id }}
          />
          <Tabs.Screen
            name="Avaliacao"
            options={{
              title: 'Avaliação',
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="clipboard-outline" size={size} color={color} />
              ),
            }}
            initialParams={{ id: id }}
          />
        </Tabs>
      </View>
    </View>
  );
};

const localStyles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  header: {
    backgroundColor: Theme.light.background,
    top: 0,
    width: '100%',
    justifyContent: 'center',
    borderBottomWidth: 3,
    borderColor: Theme.light.text,
    flexDirection: 'row',
    alignItems: 'center',
  },
  fotoContainer: {
    width: 150,
    height: 150,
    borderColor: Theme.light.text,
    borderRadius: 15,
    margin: 30,
  },
  foto: {
    width: 150,
    height: 150,
    borderWidth: 4,
    borderColor: Theme.light.text,
    borderRadius: 15,
    backgroundColor: 'white',
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    color: Theme.light.text,
  },
  bodyContainer: {
    paddingTop: 10,
    flex: 1,
    padding: 0,
    backgroundColor: Theme.light.background,
  },
});

export default GameProfile;
