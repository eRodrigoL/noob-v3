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

interface User {
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
  const [editedUser, setEditedUser] = useState<User>({ nome: '', foto: null, capa: null });

  const isPasswordStrong = (password: string) => {
    const strongPasswordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return strongPasswordRegex.test(password);
  };

  const handleRegister = async () => {
    if (!editedUser.nome || !apelido || !nascimento || !email || !senha || !confirmarSenha) {
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

    const nomeSanitizado = sanitizeInput(editedUser.nome);
    const apelidoSanitizado = sanitizeInput(apelido);
    const nascimentoSanitizado = sanitizeInput(nascimento);
    const emailSanitizado = sanitizeInput(email);
    const senhaSanitizada = sanitizeInput(senha);

    try {
      /*const formData = new FormData();
      formData.append('nome', editedUser.nome);
      formData.append('apelido', `@${apelido}`);
      formData.append('nascimento', nascimento);
      formData.append('email', email);
      formData.append('senha', senha);*/

      const formData = new FormData();
      formData.append('nome', nomeSanitizado);
      formData.append('apelido', `@${apelidoSanitizado}`);
      formData.append('nascimento', nascimentoSanitizado);
      formData.append('email', emailSanitizado);
      formData.append('senha', senhaSanitizada);

      if (editedUser.foto) {
        const filename = editedUser.foto.split('/').pop();
        const match = /\.(\w+)$/.exec(filename ?? '');
        const fileType = match ? `image/${match[1]}` : 'image';
        formData.append('foto', {
          uri: editedUser.foto,
          name: filename,
          type: fileType,
        } as any);
      }

      if (editedUser.capa) {
        const filename = editedUser.capa.split('/').pop();
        const match = /\.(\w+)$/.exec(filename ?? '');
        const fileType = match ? `image/${match[1]}` : 'image';
        formData.append('capa', {
          uri: editedUser.capa,
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
      <HeaderLayout title="Criar sua conta">
        <ProfileLayout initialIsRegisting={true} isUser={true} setEdited={setEditedUser}>
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
            accessible
            accessibilityLabel="Campo de apelido"
            accessibilityHint="Digite um apelido para seu perfil"
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
            accessible
            accessibilityLabel="Campo de email"
            accessibilityHint="Digite seu endereço de email"
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
            accessible
            accessibilityLabel="Campo de data de nascimento"
            accessibilityHint="Informe sua data de nascimento no formato dia, mês e ano"
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
            accessible
            accessibilityLabel="Campo de senha"
            accessibilityHint="Crie uma senha com no mínimo 8 caracteres, uma letra maiúscula e um caractere especial"
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
            accessible
            accessibilityLabel="Campo de confirmação de senha"
            accessibilityHint="Repita a senha que você digitou acima para confirmação"
          />

          <ButtonHighlight
            title="Cadastrar" onPress={handleRegister}
            accessibilityLabel="Botão cadastrar"
            accessibilityHint="Envia o formulário de cadastro"
          />
          <ButtonSemiHighlight
            title="Cancelar" onPress={() => router.replace('/boardgame')}
            accessibilityLabel="Botão cancelar"
            accessibilityHint="Cancela o cadastro e retorna para a lista de jogos"
          />
        </ProfileLayout>
      </HeaderLayout>
    </View>
  );
};

export default UserRegister;
