import Header from '@components/Header';
import ParallaxProfile from '@components/ParallaxProfile';
import { logger } from '@lib/logger';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient } from '@services/apiClient';
import styles from '@theme/themOld/globalStyle';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';

const EditUser: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(true);
  const [editedUser, setEditedUser] = useState<any>(null);

  // Função para buscar os dados do usuário
  const fetchUserData = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      const token = await AsyncStorage.getItem('token');

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
      const userId = await AsyncStorage.getItem('userId');
      const token = await AsyncStorage.getItem('token');

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

      if (editedUser.capa) {
        const localUri = editedUser.capa;
        const filename = localUri.split('/').pop();
        const match = /\.(\w+)$/.exec(filename ?? '');
        const fileType = match ? `image/${match[1]}` : `image`;

        formData.append('capa', {
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

  const addOneDay = (dateString: string) => {
    const date = new Date(dateString);
    date.setDate(date.getDate() + 1); // Adiciona 1 dia
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };
  // TRECHO API -- FIM

  return (
    <View style={{ flex: 1 }}>
      {/* Exibe o cabeçalho com título */}
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
        {/* Apelido */}
        <Text style={styles.label}>Apelido:</Text>
        <Text style={styles.label}>{user.apelido}</Text>

        {/* Email */}
        <Text style={styles.label}>Email:</Text>
        {isEditing ? (
          <TextInput
            style={styles.input}
            value={editedUser.email}
            onChangeText={(text) =>
              setEditedUser((prevState: any) => ({
                ...prevState,
                email: text,
              }))
            }
          />
        ) : (
          <Text style={styles.label}>{user.email}</Text>
        )}

        {/* Data de Nascimento */}
        <Text style={styles.label}>Data de Nascimento:</Text>
        {isEditing ? (
          <TextInput style={styles.input} value={addOneDay(editedUser.nascimento)} />
        ) : (
          <Text style={styles.label}>{addOneDay(user.nascimento)}</Text>
        )}

        {/* Botão de Editar/Salvar */}
        <TouchableOpacity
          style={styles.buttonPrimary}
          onPress={() => {
            updateUserProfile();
            router.back();
          }}>
          <Text style={styles.buttonPrimaryText}>Salvar</Text>
        </TouchableOpacity>

        {/* Botão Cancelar visível apenas se isEditing for true */}
        {isEditing && (
          <TouchableOpacity
            style={styles.buttonSecondary}
            onPress={() => {
              setEditedUser(user); // Reverte as mudanças, restaurando os dados originais
              router.back();
            }}>
            <Text style={styles.buttonSecondaryText}>Cancelar</Text>
          </TouchableOpacity>
        )}
      </ParallaxProfile>
    </View>
  );
};

export default EditUser;
