// app/(app)/profile/overview/index.tsx
import { ButtonHighlight, ButtonSemiHighlight, HeaderLayout } from '@components/index';
import ProfileLayout from '@components/layouts/ProfileLayout';
import { logger } from '@lib/logger';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient } from '@services/apiClient';
import { globalStyles, useTheme } from '@theme/index';
import React, { useEffect, useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import Toast from 'react-native-toast-message';

const Overview: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<any>(null);
  const { colors, fontSizes, fontFamily } = useTheme();

  // Função para buscar os dados do usuário
  const fetchUserData = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      const token = await AsyncStorage.getItem('token');

      if (!userId || !token) {
        Toast.show({
          type: 'error',
          text1: 'Sessão expirada',
          text2: 'Por favor, faça login novamente para acessar seu perfil.',
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
        text1: 'Erro ao carregar',
        text2: 'Não foi possível acessar seus dados. Tente novamente.',
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
        text1: '⛔ Nome e e-mail são obrigatórios',
        text2: 'Verifique os campos e tente novamente.',
      });
      return;
    }

    try {
      const userId = await AsyncStorage.getItem('userId');
      const token = await AsyncStorage.getItem('token');

      if (!userId || !token) {
        Toast.show({
          type: 'error',
          text1: 'Sessão expirada',
          text2: 'Por favor, faça login novamente para acessar seu perfil.',
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
        text1: '✅ Alterações salvas',
        text2: 'Seu perfil foi atualizado com sucesso.',
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
        text1: 'Falha ao salvar',
        text2: 'Verifique sua conexão ou tente novamente mais tarde.',
      });
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  // Função para alternar entre edição e exibição
  const handleEditToggle = () => {
    if (isEditing) {
      // Salva as alterações ao sair do modo de edição
      updateUserProfile();
    }
    setIsEditing(!isEditing);
  };

  if (loading) {
    return (
      <View style={globalStyles.container}>
        <Text>Carregando dados do usuário...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={globalStyles.container}>
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
      <HeaderLayout title="Perfil">
        <ProfileLayout
          id={user._id}
          name={user.nome}
          photo={user.foto}
          cover={user.capa}
          initialIsRegisting={false}
          isEditing={isEditing}
          isUser={true}
          setEdited={setEditedUser}>
          {/* Apelido */}
          <Text
            style={[
              globalStyles.textJustifiedBoldItalic,
              { color: colors.textOnBase, fontFamily, fontSize: fontSizes.base },
            ]}>
            Apelido:
          </Text>
          <TextInput
            style={[
              globalStyles.input,
              { color: colors.textOnBase, fontFamily, fontSize: fontSizes.base },
            ]}
            value={user.apelido}
            editable={false}
            selectTextOnFocus={false}
          />

          {/* Email */}
          <Text
            style={[
              globalStyles.textJustifiedBoldItalic,
              { color: colors.textOnBase, fontFamily, fontSize: fontSizes.base },
            ]}>
            Email:
          </Text>
          {isEditing ? (
            <TextInput
              style={[
                globalStyles.input,
                { color: colors.textOnBase, fontFamily, fontSize: fontSizes.base },
              ]}
              value={editedUser.email}
              onChangeText={(text) =>
                setEditedUser((prevState: any) => ({
                  ...prevState,
                  email: text,
                }))
              }
            />
          ) : (
            <TextInput
              style={[
                globalStyles.input,
                { color: colors.textOnBase, fontFamily, fontSize: fontSizes.base },
              ]}
              value={user.email}
              editable={false}
              selectTextOnFocus={false}
            />
          )}

          {/* Data de Nascimento */}
          <Text
            style={[
              globalStyles.textJustifiedBoldItalic,
              { color: colors.textOnBase, fontFamily, fontSize: fontSizes.base },
            ]}>
            Data de Nascimento:
          </Text>
          {isEditing ? (
            <TextInput
              style={[
                globalStyles.input,
                { color: colors.textOnBase, fontFamily, fontSize: fontSizes.base },
              ]}
              value={addOneDay(editedUser.nascimento)}
            />
          ) : (
            <TextInput
              style={[
                globalStyles.input,
                { color: colors.textOnBase, fontFamily, fontSize: fontSizes.base },
              ]}
              value={addOneDay(user.nascimento)}
              editable={false}
              selectTextOnFocus={false}
            />
          )}

          {/* Botão de Editar/Salvar */}
          <ButtonHighlight
            title={isEditing ? 'Salvar' : 'Editar Perfil'}
            onPress={handleEditToggle}
          />

          {/* Botão Cancelar visível apenas se isEditing for true */}
          {isEditing && (
            <ButtonSemiHighlight
              title="Cancelar"
              onPress={() => {
                setIsEditing(false);
                setEditedUser(user);
              }}
            />
          )}
        </ProfileLayout>
      </HeaderLayout>
    </View>
  );
};

export default Overview;
