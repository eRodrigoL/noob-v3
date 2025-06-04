// app/(auth)/register/index.tsx
import { ButtonHighlight, ButtonSemiHighlight, HeaderLayout } from '@components/index';
import ProfileLayout from '@components/layouts/ProfileLayout';
import { logger } from '@lib/logger';
import { apiClient } from '@services/apiClient';
import { globalStyles, useTheme } from '@theme/index';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import { TextInputMask } from 'react-native-masked-text';
import Toast from 'react-native-toast-message';

const UserRegister: React.FC = () => {
  const router = useRouter();
  const { colors, fontSizes, fontFamily } = useTheme();
  const [nome, setNome] = useState('');
  const [apelido, setApelido] = useState('');
  const [nascimento, setNascimento] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [capaUri, setCapaUri] = useState<string | null>(null);

  const pickImage = async (setImage: (uri: string | null) => void) => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Toast.show({ type: 'error', text1: 'Permissão necessária para acessar a galeria!' });
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  const isPasswordStrong = (password: string) => {
    const strongPasswordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return strongPasswordRegex.test(password);
  };

  const handleRegister = async () => {
    if (!nome || !apelido || !email || !senha || !confirmarSenha) {
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

    try {
      const formData = new FormData();
      formData.append('nome', nome);
      formData.append('apelido', `@${apelido}`);
      formData.append('nascimento', nascimento);
      formData.append('email', email);
      formData.append('senha', senha);

      if (imageUri) {
        const filename = imageUri.split('/').pop();
        const match = /\.(\w+)$/.exec(filename ?? '');
        const fileType = match ? `image/${match[1]}` : 'image';
        formData.append('foto', {
          uri: imageUri,
          name: filename,
          type: fileType,
        } as any);
      }

      if (capaUri) {
        const filename = capaUri.split('/').pop();
        const match = /\.(\w+)$/.exec(filename ?? '');
        const fileType = match ? `image/${match[1]}` : 'image';
        formData.append('capa', {
          uri: capaUri,
          name: filename,
          type: fileType,
        } as any);
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
      logger.error('Erro ao registrar usuário:', error);
      Toast.show({
        type: 'error',
        text1: 'Erro ao registrar',
        text2: 'Verifique os dados e tente novamente.',
      });
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Exibe o cabeçalho com título */}
      <HeaderLayout title="Criar sua conta">
        <ProfileLayout initialIsRegisting={true} isUser={true}>
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

          {/* Confirmaçãode senha */}
          <Text
            style={[
              globalStyles.textJustifiedBoldItalic,
              { color: colors.textOnBase, fontFamily, fontSize: fontSizes.base },
            ]}>
            Confirmaçãode senha:
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

          {/* Botão de Editar/Salvar */}
          <ButtonHighlight title="Cadastrar" onPress={handleRegister} />

          <ButtonSemiHighlight title="Cancelar" onPress={() => router.replace('/boardgame')} />
        </ProfileLayout>
      </HeaderLayout>
    </View>
  );
};

export default UserRegister;
