// app/(app)/boardgame/registerGame/index.tsx
import { ButtonHighlight, ButtonSemiHighlight, HeaderLayout } from '@components/index';
import ProfileLayout from '@components/layouts/ProfileLayout';
import { logger } from '@lib/logger';
import { apiClient } from '@services/apiClient';
import { storage } from '@store/storage';
import { globalStyles, useTheme } from '@theme/index';
import axios from 'axios';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import Toast from 'react-native-toast-message';

interface ProfileEntity {
  nome: string;
  foto?: string | null;
  capa?: string | null;
}

const GameRegister: React.FC = () => {
  const router = useRouter();
  const { colors, fontSizes, fontFamily } = useTheme();

  const [ano, setAno] = useState('');
  const [idade, setIdade] = useState('');
  const [designer, setDesigner] = useState('');
  const [artista, setArtista] = useState('');
  const [editora, setEditora] = useState('');
  const [categoria, setCategoria] = useState('');
  const [componentes, setComponentes] = useState('');
  const [descricao, setDescricao] = useState('');
  const [digitalLink, setDigitalLink] = useState('');
  const [editedData, setEditedData] = useState<ProfileEntity>({ nome: '', foto: null, capa: null });

  const handleRegister = async () => {
    if (!editedData.nome) {
      Toast.show({ type: 'error', text1: 'Preencha os campos obrigatórios.' });
      return;
    }

    try {
      const userId = await storage.getItem('userId');
      const token = await storage.getItem('token');
      const formData = new FormData();
      formData.append('nome', editedData.nome);

      const parsedAno = parseInt(ano);
      if (!isNaN(parsedAno)) {
        formData.append('ano', parsedAno.toString());
      }

      formData.append('idade', idade);
      formData.append('designer', designer);
      formData.append('artista', artista);
      formData.append('editora', editora);
      formData.append('digital', digitalLink);
      formData.append('categoria', categoria);
      formData.append('componentes', componentes);
      formData.append('descricao', descricao);

      if (editedData.foto) {
        const filename = editedData.foto.split('/').pop();
        const match = /\.(\w+)$/.exec(filename ?? '');
        const fileType = match ? `image/${match[1]}` : 'image';
        formData.append('foto', {
          uri: editedData.foto,
          name: filename,
          type: fileType,
        } as any);
      }

      if (editedData.capa) {
        const filename = editedData.capa.split('/').pop();
        const match = /\.(\w+)$/.exec(filename ?? '');
        const fileType = match ? `image/${match[1]}` : 'image';
        formData.append('capa', {
          uri: editedData.capa,
          name: filename,
          type: fileType,
        } as any);
      }

      const response = await apiClient.post('/jogos', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 201) {
        Toast.show({
          type: 'success',
          text1: response.data.message || 'Jogo registrado com sucesso!',
        });
        router.replace('/boardgame');
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        logger.error('Erro detalhado da API:', error.response?.data);
        Toast.show({
          type: 'error',
          text1: 'Erro ao registrar',
          text2: error.response?.data?.message || 'Erro desconhecido.',
        });
      } else {
        logger.error('Erro genérico:', error);
        Toast.show({
          type: 'error',
          text1: 'Erro inesperado',
          text2: 'Verifique os dados e tente novamente.',
        });
      }
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <HeaderLayout title="Registrar Jogo">
        <ProfileLayout initialIsRegisting={true} setEdited={setEditedData}>
          {[
            { label: 'Ano:', value: ano, onChange: setAno, keyboardType: 'numeric' },
            { label: 'Idade recomendada:', value: idade, onChange: setIdade },
            { label: 'Designer:', value: designer, onChange: setDesigner },
            { label: 'Artista:', value: artista, onChange: setArtista },
            { label: 'Editora:', value: editora, onChange: setEditora },
            { label: 'Categoria:', value: categoria, onChange: setCategoria },
            { label: 'Componentes:', value: componentes, onChange: setComponentes },
            {
              label: 'Descrição:',
              value: descricao,
              onChange: setDescricao,
              multiline: true,
              height: 100,
            },
            {
              label: 'Link para versão digital (opcional):',
              value: digitalLink,
              onChange: setDigitalLink,
            },
          ].map(({ label, value, onChange, keyboardType, multiline, height = 50 }, index) => (
            <View key={index} style={{ marginBottom: 8 }}>
              <Text
                style={[
                  globalStyles.textJustifiedBoldItalic,
                  { color: colors.textOnBase, fontFamily, fontSize: fontSizes.base },
                ]}>
                {label}
              </Text>
              <TextInput
                style={[
                  globalStyles.input,
                  {
                    color: colors.textOnBase,
                    fontFamily,
                    fontSize: fontSizes.base,
                    height,
                    textAlignVertical: multiline ? 'top' : 'center',
                  },
                ]}
                value={value}
                onChangeText={onChange}
                keyboardType={keyboardType as any}
                multiline={multiline}
              />
            </View>
          ))}

          <ButtonHighlight title="Cadastrar" onPress={handleRegister} />
          <ButtonSemiHighlight title="Cancelar" onPress={() => router.replace('/boardgame')} />
        </ProfileLayout>
      </HeaderLayout>
    </View>
  );
};

export default GameRegister;
