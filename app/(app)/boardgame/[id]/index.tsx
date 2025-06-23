// app/(app)/boardgame/[id]/index.tsx
import {
  ButtonHighlight,
  ButtonSemiHighlight,
  HeaderLayout,
  ProfileLayout,
} from '@components/index';
import { useGameId } from '@hooks/useGameId';
import { logger } from '@lib/logger';
import { apiClient } from '@services/apiClient';
import { storage } from '@store/storage';
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
  const [editedData, seteditedData] = useState<any>(null);
  const { colors, fontFamily, fontSizes } = useTheme();

  // Função para buscar os dados do usuário
  const fetchGameData = async () => {
    try {
      setLoading(true);
      const token = await storage.getItem('token');
      setIsLoggedIn(!!token); // define como true se houver token

      const response = await apiClient.get(`/jogos/${id}`);
      setGame(response.data);
      seteditedData(response.data);
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
    if (!editedData || !editedData.nome) {
      Toast.show({
        type: 'error',
        text1: '⛔ Nome é obrigatório',
        text2: 'Verifique os campos e tente novamente.',
      });
      return;
    }

    try {
      const token = await storage.getItem('token');
      if (!token) {
        Toast.show({
          type: 'error',
          text1: 'Sessão expirada',
          text2: 'Faça login novamente para editar.',
        });
        return;
      }

      const formData = new FormData();
      formData.append('nome', editedData.nome);
      formData.append('idade', editedData.idade);
      formData.append('designer', editedData.designer);
      formData.append('editora', editedData.editora);
      formData.append('categoria', editedData.categoria);
      formData.append('componentes', editedData.componentes);
      formData.append('descricao', editedData.descricao);

      // Helper: é URI local?
      const isLocalUri = (uri: any): uri is string =>
        typeof uri === 'string' && uri.startsWith('file://');

      // Adiciona imagem de perfil (foto)
      if (editedData.foto) {
        if (isLocalUri(editedData.foto)) {
          const filename = editedData.foto.split('/').pop()!;
          const match = /\.(\w+)$/.exec(filename);
          const fileType = match ? `image/${match[1]}` : 'image';

          formData.append('foto', {
            uri: editedData.foto,
            name: filename,
            type: fileType,
          } as any);
        } else {
          formData.append('foto', editedData.foto as any); // File no navegador ou objeto { uri, name, type }
        }
      }

      // Adiciona imagem de capa
      if (editedData.capa) {
        if (isLocalUri(editedData.capa)) {
          const filename = editedData.capa.split('/').pop()!;
          const match = /\.(\w+)$/.exec(filename);
          const fileType = match ? `image/${match[1]}` : 'image';

          formData.append('capa', {
            uri: editedData.capa,
            name: filename,
            type: fileType,
          } as any);
        } else {
          formData.append('capa', editedData.capa as any);
        }
      }

      await apiClient.put(`/jogos/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

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

  const renderField = (label: string, value: string, field: keyof typeof editedData) => (
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
          value={editedData[field]}
          onChangeText={(text) => seteditedData((prev: any) => ({ ...prev, [field]: text }))}
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
        name={game.nome}
        photo={game.foto}
        cover={null}
        isEditing={isEditing}
        isUser={false}
        isLoading={loading}
        setEdited={seteditedData}>
        {renderField('Lançamento:', game.ano, 'ano')}
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
              seteditedData(game);
            }}
          />
        )}
      </ProfileLayout>
    </HeaderLayout>
  );
};

export default GameDetails;
