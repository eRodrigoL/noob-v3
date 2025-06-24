// app/(auth)/registerUser/index.tsx
import { ButtonHighlight, ButtonSemiHighlight, HeaderLayout } from '@components/index';
import ProfileLayout from '@components/layouts/ProfileLayout';
import { logger } from '@lib/logger';
import { apiClient } from '@services/apiClient';
import { globalStyles, useTheme } from '@theme/index';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import { TextInputMask } from 'react-native-masked-text';
import Toast from 'react-native-toast-message';
import { sanitizeInput } from '@utils/sanitize';
import axios from 'axios';

interface ProfileEntity {
  nome: string;
  foto?: string | null;
  capa?: string | null;
}

const UserRegister: React.FC = () => {
  const router = useRouter();
  const { colors, fontSizes, fontFamily } = useTheme();

  const [apelido, setApelido] = useState('');
  const [nascimento, setNascimento] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [editedData, setEditedData] = useState<ProfileEntity>({ nome: '', foto: null, capa: null });

  const isPasswordStrong = (password: string) => {
    const strongPasswordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return strongPasswordRegex.test(password);
  };

  const handleRegister = async () => {
    if (!editedData.nome || !apelido || !nascimento || !email || !senha || !confirmarSenha) {
      Toast.show({ type: 'error', text1: 'Preencha todos os campos obrigatórios.' });
      return;
    }

    if (senha !== confirmarSenha) {
      Toast.show({ type: 'error', text1: 'As senhas não coincidem.' });
      return;
    }

    if (!isPasswordStrong(senha)) {
      Toast.show({
        type: 'error',
        text1: 'Senha fraca',
        text2: 'Use pelo menos 8 caracteres, uma letra maiúscula e um caractere especial.',
      });
      return;
    }

    const nomeSanitizado = sanitizeInput(editedData.nome);
    const apelidoSanitizado = sanitizeInput(apelido);
    const nascimentoSanitizado = sanitizeInput(nascimento);
    const emailSanitizado = sanitizeInput(email);
    const senhaSanitizada = sanitizeInput(senha);

    const montarFormData = (foto: any, capa: any) => {
      const formData = new FormData();
      formData.append('nome', nomeSanitizado);
      formData.append('apelido', `@${apelidoSanitizado}`);
      formData.append('nascimento', nascimentoSanitizado);
      formData.append('email', emailSanitizado);
      formData.append('senha', senhaSanitizada);

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
    // tentativa padrão (web ou arquivo bem formado)
    try {
      const formDataWeb = montarFormData(editedData.foto, editedData.capa);

      const response = await apiClient.post('/usuarios', formDataWeb, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.status === 201) {
        Toast.show({
          type: 'success',
          text1: response.data.message || 'Usuário criado com sucesso!',
        });
        router.replace('/login');
      }
    } catch (error1: unknown) {
      logger.warn(
        'Tentativa padrão falhou, tentando fallback Android:',
        error1
      );

      // fallback forçado (mobile com file://)
      try {
        const getUri = (imagem: any) =>
          typeof imagem === 'object' && imagem !== null && 'uri' in imagem
            ? imagem.uri
            : imagem;

        const foto = getUri(editedData.foto);
        const capa = getUri(editedData.capa);
        const formDataMobile = montarFormData(foto, capa);

        const response = await apiClient.post('/usuarios', formDataMobile, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        if (response.status === 201) {
          Toast.show({
            type: 'success',
            text1: response.data.message || 'Usuário criado com sucesso!',
          });
          router.replace('/login');
        }
      } catch (error2: unknown) {
        if (axios.isAxiosError(error2) && error2.response?.data?.message) {
          Toast.show({
            type: 'error',
            text1: 'Erro ao registrar',
            text2: error2.response.data.message,
          });
        } else {
          logger.error('Erro definitivo ao registrar usuário:', error2);
          Toast.show({
            type: 'error',
            text1: 'Erro ao registrar',
            text2: 'Verifique os dados e tente novamente.',
          });
        }
      }
    }
  }


  return (
    <View style={{ flex: 1 }}>
      <HeaderLayout title="Criar sua conta">
        <ProfileLayout isRegisting={true} setEdited={setEditedData} isUser={true}>
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
            placeholder="Apelido"
            value={`@${apelido}`}
            onChangeText={(text) => setApelido(text.replace('@', ''))}
            autoCapitalize="none"
          />

          {/* Email */}
          <Text
            style={[
              globalStyles.textJustifiedBoldItalic,
              { color: colors.textOnBase, fontFamily, fontSize: fontSizes.base },
            ]}>
            Email:
          </Text>
          <TextInput
            style={[
              globalStyles.input,
              { color: colors.textOnBase, fontFamily, fontSize: fontSizes.base },
            ]}
            placeholder="Email"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />

          {/* Data de Nascimento */}
          <Text
            style={[
              globalStyles.textJustifiedBoldItalic,
              { color: colors.textOnBase, fontFamily, fontSize: fontSizes.base },
            ]}>
            Data de Nascimento:
          </Text>
          <TextInputMask
            style={[
              globalStyles.input,
              { color: colors.textOnBase, fontFamily, fontSize: fontSizes.base },
            ]}
            type="datetime"
            options={{ format: 'DD/MM/YYYY' }}
            placeholder="Data de nascimento"
            value={nascimento}
            onChangeText={setNascimento}
          />

          {/* Senha */}
          <Text
            style={[
              globalStyles.textJustifiedBoldItalic,
              { color: colors.textOnBase, fontFamily, fontSize: fontSizes.base },
            ]}>
            Senha:
          </Text>
          <TextInput
            style={[
              globalStyles.input,
              { color: colors.textOnBase, fontFamily, fontSize: fontSizes.base },
            ]}
            placeholder="Senha"
            secureTextEntry
            value={senha}
            onChangeText={setSenha}
          />

          {/* Confirmação de Senha */}
          <Text
            style={[
              globalStyles.textJustifiedBoldItalic,
              { color: colors.textOnBase, fontFamily, fontSize: fontSizes.base },
            ]}>
            Confirmação de senha:
          </Text>
          <TextInput
            style={[
              globalStyles.input,
              { color: colors.textOnBase, fontFamily, fontSize: fontSizes.base },
            ]}
            placeholder="Confirmar senha"
            secureTextEntry
            value={confirmarSenha}
            onChangeText={setConfirmarSenha}
          />

          <ButtonHighlight title="Cadastrar" onPress={handleRegister} />
          <ButtonSemiHighlight title="Cancelar" onPress={() => router.replace('/boardgame')} />
        </ProfileLayout>
      </HeaderLayout>
    </View>
  );
};

export default UserRegister;