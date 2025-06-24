// app/(app)/profile/index.tsx
import {
  ButtonHighlight,
  ButtonSemiHighlight,
  HeaderLayout,
  ProfileLayout,
} from '@components/index';
import { logger } from '@lib/logger';
import { apiClient } from '@services/apiClient';
import { storage } from '@store/storage';
import { globalStyles, useTheme } from '@theme/index';
import React, { useEffect, useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import Toast from 'react-native-toast-message';

const Overview: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, seteditedData] = useState<any>(null);
  const { colors, fontSizes, fontFamily } = useTheme();

  // Função para buscar os dados do usuário
  const fetchUserData = async () => {
    try {
      const userId = await storage.getItem('userId');
      const token = await storage.getItem('token');

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
      seteditedData(response.data);
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
    if (!editedData || !editedData.nome || !editedData.email) {
      Toast.show({
        type: 'error',
        text1: '⛔ Nome e e-mail são obrigatórios',
        text2: 'Verifique os campos e tente novamente.',
      });
      return;
    }

    const userId = await storage.getItem('userId');
    const token = await storage.getItem('token');

    if (!userId || !token) {
      Toast.show({
        type: 'error',
        text1: 'Sessão expirada',
        text2: 'Por favor, faça login novamente.',
      });
      return;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    };

    const montarFormData = (foto: any, capa: any) => {
      const formData = new FormData();
      formData.append('nome', editedData.nome);
      formData.append('email', editedData.email);
      formData.append('nascimento', editedData.nascimento);

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

    // tentativa padrão (web ou arquivo bem formado)
    try {
      const formDataWeb = montarFormData(editedData.foto, editedData.capa);
      await apiClient.put(`/usuarios/${userId}`, formDataWeb, config);

      Toast.show({
        type: 'success',
        text1: '✅ Alterações salvas',
        text2: 'Seu perfil foi atualizado com sucesso.',
      });

      fetchUserData();
    } catch (error1: any) {
      logger.warn(
        'Tentativa web falhou, tentando fallback Android:',
        error1?.response?.data || error1
      );

      // fallback forçado (mobile com file://)
      try {
        const foto = editedData.foto?.uri || editedData.foto;
        const capa = editedData.capa?.uri || editedData.capa;
        const formDataMobile = montarFormData(foto, capa);

        await apiClient.put(`/usuarios/${userId}`, formDataMobile, config);

        Toast.show({
          type: 'success',
          text1: '✅ Alterações salvas',
          text2: 'Seu perfil foi atualizado com sucesso.',
        });

        fetchUserData();
      } catch (error2: any) {
        logger.error('Erro definitivo ao salvar perfil:', error2?.response?.data || error2);

        Toast.show({
          type: 'error',
          text1: '❌ Falha ao salvar',
          text2: 'Verifique os campos e tente novamente.',
        });
      }
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
      <HeaderLayout title="Perfil">
        <ProfileLayout isUser={true} isLoading />
      </HeaderLayout>
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
    <HeaderLayout title="Perfil">
      <ProfileLayout
        id={user._id}
        name={user.nome}
        photo={user.foto}
        cover={user.capa}
        isEditing={isEditing}
        isUser={true}
        isLoading={loading}
        setEdited={seteditedData}>
        {/* Apelido */}
        <Text
          style={[
            globalStyles.textJustifiedBoldItalic,
            { color: colors.textOnBase, fontFamily, fontSize: fontSizes.base },
          ]}>
          Apelido:
        </Text>
        <TextInput
          accessibilityLabel="Campo de apelido. Este campo não pode ser editado"
          style={[
            globalStyles.input,
            { color: colors.textOnBase, fontFamily, fontSize: fontSizes.base },
          ]}
          value={user.apelido}
          editable={false}
          selectTextOnFocus={false}
        />

        {/* Email */}
        {renderField('Email:', user.email, 'email')}

        {/* Data de Nascimento */}
        <Text
          accessibilityLabel="Campo de data de nascimento"
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
            value={addOneDay(editedData.nascimento)}
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
          accessibilityLabel={
            isEditing ? 'Botão para salvar alterações no perfil' : 'Botão para editar o perfil'
          }
          title={isEditing ? 'Salvar' : 'Editar Perfil'}
          onPress={handleEditToggle}
        />

        {/* Botão Cancelar visível apenas se isEditing for true */}
        {isEditing && (
          <ButtonSemiHighlight
            accessibilityLabel="Botão para cancelar edição do perfil"
            title="Cancelar"
            onPress={() => {
              setIsEditing(false);
              seteditedData(user);
            }}
          />
        )}
      </ProfileLayout>
    </HeaderLayout>
  );
};

export default Overview;
