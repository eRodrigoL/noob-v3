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

    try {
      const formData = new FormData();
      formData.append('nome', nomeSanitizado);
      formData.append('apelido', `@${apelidoSanitizado}`);
      formData.append('nascimento', nascimentoSanitizado);
      formData.append('email', emailSanitizado);
      formData.append('senha', senhaSanitizada);

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

      const response = await apiClient.post('/usuarios', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.status === 201) {
        Toast.show({
          type: 'success',
          text1: response.data.message || 'Usuário criado com sucesso!',
        });
        router.replace('/login');
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.data?.message) {
    Toast.show({
      type: 'error',
      text1: 'Erro ao registrar',
      text2: error.response.data.message,
    });
    } else {
    Toast.show({
      type: 'error',
      text1: 'Erro ao registrar',
      text2: 'Verifique os dados e tente novamente.',
    });
  }}
  };

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
