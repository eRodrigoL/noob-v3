// app/(legacy)/user/(userProfile)/_layout.tsx
import Header from '@components/Header';
import ParallaxProfile from '@components/ParallaxProfile';
import { Ionicons } from '@expo/vector-icons';
import { logger } from '@lib/logger';
import { apiClient } from '@services/apiClient';
import styles from '@theme/themOld/globalStyle';
import { Tabs } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { storage } from '@store/storage';

const UserProfile: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<any>(null);

  // Função para buscar os dados do usuário
  const fetchUserData = async () => {
    try {
      const userId = await storage.getItem('userId');
      const token = await storage.getItem('token');

      if (!userId || !token) {
        Toast.show({
          type: 'error',
          text1: 'Erro',
          text2: 'ID do usuário ou token não encontrados.',
        });
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await apiClient.get(`/usuarios/${userId}`, config);

      setUser(response.data);
      setEditedUser(response.data);
    } catch (error) {
      logger.error('Erro ao buscar os dados do usuário:', error);
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: 'Não foi possível carregar os dados do usuário.',
      });
    } finally {
      setLoading(false);
    }
  };

  // Função para enviar os dados atualizados
  const updateUserProfile = async () => {
    if (!editedUser || !editedUser.nome || !editedUser.email) {
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: 'Nome e email são obrigatórios.',
      });
      return;
    }

    try {
      const userId = await storage.getItem('userId');
      const token = await storage.getItem('token');

      if (!userId || !token) {
        Toast.show({
          type: 'error',
          text1: 'Erro',
          text2: 'ID do usuário ou token não encontrados.',
        });
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      };

      const formData = new FormData();
      formData.append('nome', editedUser.nome);
      formData.append('email', editedUser.email);
      formData.append('nascimento', editedUser.nascimento);

      if (editedUser.foto) {
        const localUri = editedUser.foto;
        const filename = localUri.split('/').pop();
        const match = /\.(\w+)$/.exec(filename ?? '');
        const fileType = match ? `image/${match[1]}` : `image`;

        formData.append('foto', {
          uri: localUri,
          name: filename ?? 'profile.jpg',
          type: fileType,
        } as any);
      }

      await apiClient.put(`/usuarios/${userId}`, formData, config);

      Toast.show({
        type: 'success',
        text1: 'Perfil atualizado!',
        text2: 'Suas informações foram salvas com sucesso.',
      });

      // Recarregar os dados do usuário após a atualização
      fetchUserData();
    } catch (error: any) {
      if (error.response) {
        logger.error('Erro no servidor:', error.response.data);
      } else if (error.request) {
        logger.error('Erro de rede:', error.request);
      } else {
        logger.error('Erro desconhecido:', error.message);
      }
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: 'Não foi possível atualizar o perfil.',
      });
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Carregando dados do usuário...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>Erro ao carregar os dados do usuário.</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <Header title="Perfil" />
      <ParallaxProfile
        id={user._id}
        name={user.nome}
        photo={user.foto}
        cover={user.capa}
        initialIsEditing={false}
        initialIsRegisting={false}
        isEditing={isEditing}
        setEdited={setEditedUser}>
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
                <Ionicons name="person-outline" size={size} color={color} />
              ),
            }}
            initialParams={{ user: user }}
          />
          <Tabs.Screen
            name="Desempenho"
            options={{
              title: 'Desempenho',
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="stats-chart-outline" size={size} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="Historico"
            options={{
              title: 'Histórico',
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="time-outline" size={size} color={color} />
              ),
            }}
          />
        </Tabs>
      </ParallaxProfile>
    </View>
  );
};

const localStyles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  tabBarItemStyle: {
    flex: 1,
  },
});

export default UserProfile;
