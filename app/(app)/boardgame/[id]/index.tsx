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

const GameDetails: React.FC = () => {
  const id = useGameId();
  const [game, setGame] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [editedData, setEditedData] = useState<any>(null);
  const { colors, fontFamily, fontSizes } = useTheme();

  const fetchGameData = async () => {
    try {
      setLoading(true);
      const token = await storage.getItem('token');
      setIsLoggedIn(!!token);

      const response = await apiClient.get(`/jogos/${id}`);
      setGame(response.data);
      setEditedData(response.data);
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

  const updateGameProfile = async () => {
    if (!editedData?.nome) {
      Toast.show({
        type: 'error',
        text1: '⛔ Nome é obrigatório',
        text2: 'Verifique os campos e tente novamente.',
      });
      return;
    }

    const token = await storage.getItem('token');
    if (!token) {
      Toast.show({
        type: 'error',
        text1: 'Sessão expirada',
        text2: 'Faça login novamente para editar.',
      });
      return;
    }

    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    };

    const montarFormData = (foto: any, capa: any) => {
      const formData = new FormData();
      formData.append('nome', editedData.nome);
      formData.append('ano', editedData.ano);
      formData.append('idade', editedData.idade);
      formData.append('designer', editedData.designer);
      formData.append('artista', editedData.artista);
      formData.append('editora', editedData.editora);
      formData.append('categoria', editedData.categoria);
      formData.append('componentes', editedData.componentes);
      formData.append('descricao', editedData.descricao);
      formData.append('digital', editedData.digital);

      const appendImagem = (chave: 'foto' | 'capa', valor: any) => {
        if (!valor) return;
        if (typeof valor === 'string' && valor.startsWith('file://')) {
          const nome = valor.split('/').pop()!;
          const match = /\.(\w+)$/.exec(nome);
          const tipo = match ? `image/${match[1]}` : 'image/jpeg';
          formData.append(chave, { uri: valor, name: nome, type: tipo } as any);
        } else if (valor?.uri && valor?.name && valor?.type) {
          formData.append(chave, valor);
        } else if (valor instanceof File) {
          formData.append(chave, valor);
        }
      };

      appendImagem('foto', editedData.foto);
      appendImagem('capa', editedData.capa);

      return formData;
    };

    try {
      const formData = montarFormData(editedData.foto, editedData.capa);
      await apiClient.put(`/jogos/${id}`, formData, { headers });

      Toast.show({
        type: 'success',
        text1: '✅ Alterações salvas',
        text2: 'O jogo foi atualizado com sucesso.',
      });
      fetchGameData();
    } catch (error1: any) {
      logger.warn('Primeira tentativa falhou, tentando fallback Android:', error1?.response?.data || error1);
      try {
        const fotoUri = editedData.foto?.uri || editedData.foto;
        const capaUri = editedData.capa?.uri || editedData.capa;
        const formDataFallback = montarFormData(fotoUri, capaUri);

        await apiClient.put(`/jogos/${id}`, formDataFallback, { headers });

        Toast.show({
          type: 'success',
          text1: '✅ Alterações salvas',
          text2: 'O jogo foi atualizado com sucesso.',
        });
        fetchGameData();
      } catch (error2: any) {
        logger.error('Erro definitivo ao salvar jogo:', error2?.response?.data || error2);
        Toast.show({
          type: 'error',
          text1: 'Falha ao salvar',
          text2: 'Verifique os campos ou tente novamente.',
        });
      }
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
          { color: colors.textOnBase, fontFamily, fontSize: fontSizes.base },
        ]}>
        {label}
      </Text>
      {isEditing ? (
        <TextInput
          style={[
            globalStyles.input,
            { color: colors.textOnBase, fontFamily, fontSize: fontSizes.base },
          ]}
          value={editedData?.[field] || ''}
          onChangeText={(text) => setEditedData((prev: any) => ({ ...prev, [field]: text }))}
        />
      ) : (
        <Text
          style={[
            globalStyles.input,
            { color: colors.textOnBase, fontFamily, fontSize: fontSizes.base },
          ]}>
          {value || '-'}
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
        setEdited={setEditedData}>
        {renderField('Lançamento:', game.ano, 'ano')}
        {renderField('Idade:', game.idade, 'idade')}
        {renderField('Designer:', game.designer, 'designer')}
        {renderField('Artista:', game.artista, 'artista')}
        {renderField('Editora:', game.editora, 'editora')}
        {renderField('Categoria:', game.categoria, 'categoria')}
        {renderField('Componentes:', game.componentes, 'componentes')}
        {renderField('Descrição:', game.descricao, 'descricao')}
        {renderField('Link Digital:', game.digital, 'digital')}

        {isLoggedIn && (
          <ButtonHighlight title={isEditing ? 'Salvar' : 'Editar Jogo'} onPress={handleEditToggle} />
        )}
        {isEditing && (
          <ButtonSemiHighlight
            title="Cancelar"
            onPress={() => {
              setIsEditing(false);
              setEditedData(game);
            }}
          />
        )}
      </ProfileLayout>
    </HeaderLayout>
  );
};

export default GameDetails;
