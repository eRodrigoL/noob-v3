// app/(app)/boardgame/[id]/index.tsx

// Importações de componentes, hooks, serviços, estilos e bibliotecas necessárias para o funcionamento da tela.

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

// Componente principal da página de detalhes do jogo.
const GameDetails: React.FC = () => {

  // Estado para armazenar os dados do jogo ou usuário
  const id = useGameId();
  const [game, setGame] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [editedData, seteditedData] = useState<any>(null);
  const { colors, fontFamily, fontSizes } = useTheme();

  // Função para buscar os dados do usuário da API
  const fetchGameData = async () => {
    try {
      setLoading(true); // Inicia o carregamento.
      const token = await storage.getItem('token'); // Obtém o token do usuário.
      setIsLoggedIn(!!token); // define como true se houver token


      // Requisição para obter os detalhes do jogo pelo ID.
      const response = await apiClient.get(`/jogos/${id}`);
      setGame(response.data); // Armazena os dados do jogo no estado.
      seteditedData(response.data); // Preenche os dados editáveis com os dados do jogo.
    } catch (error) {
      // Exibe mensagem de erro e registra no log.
      logger.error('Erro ao buscar os dados do jogo:', error);
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: 'Não foi possível carregar os dados do jogo.',
      });
    } finally {
      setLoading(false); // Finaliza o carregamento.
    }
  };

  // Função para enviar os dados atualizados
  const updateGameProfile = async () => {
    // Validação básica para evitar envio de dados inválidos.
    if (!editedData || !editedData.nome) {
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

    // Função auxiliar para montar o formulário com os dados do jogo.
    const montarFormData = (foto: any, capa: any) => {
      const formData = new FormData();
      formData.append('nome', editedData.nome);
      formData.append('idade', editedData.idade);
      formData.append('designer', editedData.designer);
      formData.append('editora', editedData.editora);
      formData.append('categoria', editedData.categoria);
      formData.append('componentes', editedData.componentes);
      formData.append('descricao', editedData.descricao);

      // Função para adicionar imagens ao formulário.
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

      // adiciona imagens (padrão web)
      appendImagem('foto', foto);
      appendImagem('capa', capa);

      return formData;
    };

    // Tenta enviar os dados para atualizar o jogo. (web ou arquivo bem formado)
    try {
      const formData = montarFormData(editedData.foto, editedData.capa);
      await apiClient.put(`/jogos/${id}`, formData, { headers });

      Toast.show({
        type: 'success',
        text1: '✅ Alterações salvas',
        text2: 'O jogo foi atualizado com sucesso.',
      });
      fetchGameData(); // Atualiza os dados após salvar.
    } catch (error1: any) {
      logger.warn(
        'Primeira tentativa falhou, tentando fallback Android:',
        error1?.response?.data || error1
      );

      // fallback forçado (mobile com file://) // Tenta novamente usando uma abordagem alternativa
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
        fetchGameData(); // Exibe mensagem de erro final.
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

  // Busca os dados do jogo ao carregar a página ou mudar o ID.
  useEffect(() => {
    if (id) fetchGameData();
  }, [id]);

  // Alterna entre os modos de edição e visualização
  const handleEditToggle = () => {
    if (isEditing) updateGameProfile();
    setIsEditing(!isEditing);
  };

  // Renderiza uma interface de carregamento ou o conteúdo do jogo.
  if (!game) {
    return (
      <HeaderLayout title="Jogo">
        <ProfileLayout isUser={false} isLoading />
      </HeaderLayout>
    );
  }

  // Renderiza os campos do formulário para edição ou exibição.
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

  // Renderiza a interface principal do jogo.
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
