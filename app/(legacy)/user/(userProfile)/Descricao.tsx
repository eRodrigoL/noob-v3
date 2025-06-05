// app/(legacy)/user/(userProfile)/Descricao.tsx
import { logger } from '@lib/logger';
import { apiClient } from '@services/apiClient';
import styles from '@theme/themOld/globalStyle';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { storage } from '@store/storage';

const screenWidth = Dimensions.get('window').width;

export default function Descricao() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetchUserData();
  }, []);

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
        headers: { Authorization: `Bearer ${token}` },
      };

      const response = await apiClient.get(`/usuarios/${userId}`, config);

      setUser(response.data);
    } catch (error) {
      logger.error('Erro ao buscar os dados do usuário:', error);
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: 'Não foi possível carregar os dados do usuário.',
      });
    }
  };

  const addOneDay = (dateString: string) => {
    const date = new Date(dateString);
    date.setDate(date.getDate() + 1);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  if (!user) {
    return <Text>Carregando...</Text>;
  }

  return (
    <View style={localStyles.container}>
      <ScrollView style={{ flex: 1, width: screenWidth }}>
        {/* Apelido */}
        <Text style={styles.customLabel}>Apelido:</Text>
        <Text style={styles.label}>{user.apelido}</Text>

        {/* Email */}
        <Text style={styles.customLabel}>Email:</Text>
        <Text style={styles.label}>{user.email}</Text>

        {/* Data de Nascimento */}
        <Text style={styles.customLabel}>Data de Nascimento:</Text>
        <Text style={styles.label}>{addOneDay(user.nascimento)}</Text>

        <View style={{ flex: 1, alignItems: 'center' }}>
          {/* Botão de Editar */}
          <TouchableOpacity
            style={styles.buttonPrimary}
            onPress={() => router.push('/(legacy)/user/EditUser')}>
            <Text style={styles.buttonPrimaryText}>Editar Perfil</Text>
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
