// app/(app)/boardgame/registerGame/index.tsx
import { ButtonHighlight, ButtonSemiHighlight, HeaderLayout } from '@components/index';
import ProfileLayout from '@components/layouts/ProfileLayout';
import { logger } from '@lib/logger';
import { apiClient } from '@services/apiClient';
import { storage } from '@store/storage';
import { globalStyles, useTheme } from '@theme/index';
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

    const userId = await storage.getItem('userId');
    const token = await storage.getItem('token');

    const montarFormData = (foto: any, capa: any) => {
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

    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    };

    // tentativa padrão (web ou arquivo bem formado)
    try {
      const formDataWeb = montarFormData(editedData.foto, editedData.capa);
      const response = await apiClient.post('/jogos', formDataWeb, { headers });

      if (response.status === 201) {
        Toast.show({
          type: 'success',
          text1: response.data.message || 'Jogo registrado com sucesso!',
        });
        router.replace('/boardgame');
      }
    } catch (error1: any) {
      logger.warn(
        'Tentativa web falhou, tentando fallback Android:',
        error1?.response?.data || error1
      );

      // fallback forçado (mobile com file://)
      try {
        const getUri = (imagem: any) =>
          typeof imagem === 'object' && imagem !== null && 'uri' in imagem ? imagem.uri : imagem;

        const foto = getUri(editedData.foto);
        const capa = getUri(editedData.capa);

        const formDataMobile = montarFormData(foto, capa);
        const response = await apiClient.post('/jogos', formDataMobile, { headers });

        if (response.status === 201) {
          Toast.show({
            type: 'success',
            text1: response.data.message || 'Jogo registrado com sucesso!',
          });
          router.replace('/boardgame');
        }
      } catch (error2: any) {
        logger.error('Erro definitivo ao registrar jogo:', error2?.response?.data || error2);
        Toast.show({
          type: 'error',
          text1: 'Erro ao registrar',
          text2: 'Verifique os dados e tente novamente.',
        });
      }
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <HeaderLayout title="Registrar Jogo">
        <ProfileLayout isRegisting={true} setEdited={setEditedData}>
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
