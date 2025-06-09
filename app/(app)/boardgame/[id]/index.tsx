// app/(app)/boardgame/[id]/index.tsx
import {
  ButtonHighlight,
  ButtonSemiHighlight,
  HeaderLayout,
  ProfileLayout,
} from '@components/index';
import { useGameId } from '@hooks/useGameId';
import { logger } from '@lib/logger';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient } from '@services/apiClient';
import { globalStyles, useTheme } from '@theme/index';
import React, { useEffect, useState } from 'react';
import { Text, TextInput } from 'react-native';
import Toast from 'react-native-toast-message';

// Componente principal
const GameDetails: React.FC = () => {
  // Estado para armazenar os dados do jogo ou usuário
  const id = useGameId();
  const [game, setGame] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [editedGame, setEditedGame] = useState<any>(null);
  const { colors, fontFamily, fontSizes } = useTheme();

  // Função para buscar os dados do usuário
  const fetchGameData = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      setIsLoggedIn(!!token); // define como true se houver token

      const response = await apiClient.get(`/jogos/${id}`);
      setGame(response.data);
      setEditedGame(response.data);
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

  // Função para enviar os dados atualizados
  const updateGameProfile = async () => {
    if (!editedGame || !editedGame.nome) {
      Toast.show({
        type: 'error',
        text1: '⛔ Nome é obrigatório',
        text2: 'Verifique os campos e tente novamente.',
      });
      return;
    }

    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Toast.show({
          type: 'error',
          text1: 'Sessão expirada',
          text2: 'Faça login novamente para editar.',
        });
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      };

      await apiClient.put(`/jogos/${id}`, editedGame, config);

      Toast.show({
        type: 'success',
        text1: '✅ Alterações salvas',
        text2: 'O jogo foi atualizado com sucesso.',
      });

      fetchGameData();
    } catch (error: any) {
      logger.error('Erro ao atualizar o jogo:', error);
      Toast.show({
        type: 'error',
        text1: 'Falha ao salvar',
        text2: 'Verifique sua conexão ou tente novamente mais tarde.',
      });
    }
  };

  useEffect(() => {
    if (id) fetchGameData();
  }, [id]);

  const handleEditToggle = () => {
    if (isEditing) updateGameProfile();
    setIsEditing(!isEditing);
  };

  if (!game) {
    return (
      <HeaderLayout title="Jogo">
        <ProfileLayout isUser={false} isLoading />
      </HeaderLayout>
    );
  }

  const renderField = (label: string, value: string, field: keyof typeof editedGame) => (
    <>
      <Text
        style={[
          globalStyles.textJustifiedBoldItalic,
          {
            color: colors.textOnBase,
            fontFamily,
            fontSize: fontSizes.base,
          },
        ]}>
        {label}
      </Text>
      {isEditing ? (
        <TextInput
          style={[
            globalStyles.input,
            { color: colors.textOnBase, fontFamily, fontSize: fontSizes.base },
          ]}
          value={editedGame[field]}
          onChangeText={(text) => setEditedGame((prev: any) => ({ ...prev, [field]: text }))}
        />
      ) : (
        <Text
          style={[
            globalStyles.input,
            { color: colors.textOnBase, fontFamily, fontSize: fontSizes.base },
          ]}>
          {value}
        </Text>
      )}
    </>
  );

  return (
    <HeaderLayout title="Jogo">
      <ProfileLayout
        id={game._id}
        name={game.titulo}
        photo={game.capa}
        cover={null}
        initialIsRegisting={false}
        isEditing={isEditing}
        isUser={false}
        isLoading={loading}
        setEdited={setEditedGame}>
        {renderField('Idade:', game.idade, 'idade')}
        {renderField('Designer:', game.designer, 'designer')}
        {renderField('Editora:', game.editora, 'editora')}
        {renderField('Categoria:', game.categoria, 'categoria')}
        {renderField('Componentes:', game.componentes, 'componentes')}
        {renderField('Descrição:', game.descricao, 'descricao')}

        {isLoggedIn && (
          <ButtonHighlight
            title={isEditing ? 'Salvar' : 'Editar Jogo'}
            onPress={handleEditToggle}
          />
        )}
        {isEditing && (
          <ButtonSemiHighlight
            title="Cancelar"
            onPress={() => {
              setIsEditing(false);
              setEditedGame(game);
            }}
          />
        )}
      </ProfileLayout>
    </HeaderLayout>
  );
};

export default GameDetails;
