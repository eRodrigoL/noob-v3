// app/(auth)/registerUser/index.tsx
import { ButtonHighlight, ButtonSemiHighlight, HeaderLayout } from '@components/index';
import ProfileLayout from '@components/layouts/ProfileLayout';
import { logger } from '@lib/logger';
import { apiClient } from '@services/apiClient';
import { globalStyles, useTheme } from '@theme/index';
import { sanitizeInput } from '@utils/sanitize';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import { TextInputMask } from 'react-native-masked-text';
import Toast from 'react-native-toast-message';

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

  const [tentouEnviar, setTentouEnviar] = useState(false);
  const isEmailValid = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isPasswordStrong = (password: string) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);

  const isCampoInvalido = (valor: string) => tentouEnviar && !valor;
  const isEmailInvalido = tentouEnviar && !isEmailValid(email);
  const isSenhaInvalida = tentouEnviar && !isPasswordStrong(senha);
  const isConfirmacaoInvalida = tentouEnviar && senha !== confirmarSenha;

  const styleInput = (valor: string, condExtra = false) => [
    globalStyles.input,
    {
      color: colors.textOnBase,
      fontFamily,
      fontSize: fontSizes.base,
      backgroundColor:
        isCampoInvalido(valor) || condExtra ? colors.inputError : colors.backgroundSemiHighlight,
    },
  ];

  const handleRegister = async () => {
    setTentouEnviar(true);

    if (!editedData.nome || !apelido || !nascimento || !email || !senha || !confirmarSenha) {
      Toast.show({ type: 'error', text1: 'Preencha todos os campos obrigatórios.' });
      return;
    }

    if (!isEmailValid(email)) {
      Toast.show({ type: 'error', text1: 'Email inválido.' });
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
        text2: 'Siga os critérios exigidos abaixo do campo.',
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
      formData.append('apelido', `@${apelido.toLowerCase()}`);
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
      } catch (error2: any) {
        logger.error('Erro definitivo ao registrar usuário:', error2?.response?.data || error2);
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
            style={styleInput(apelido)}
            placeholder="Apelido"
            placeholderTextColor={colors.textOnBase}
            value={`@${apelido}`}
            onChangeText={(text) => {
              const sanitized = text.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
              setApelido(sanitized);
            }}
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
            style={styleInput(email, isEmailInvalido)}
            placeholder="Email"
            placeholderTextColor={colors.textOnBase}
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
            style={styleInput(nascimento)}
            type="datetime"
            options={{ format: 'DD/MM/YYYY' }}
            placeholder="Data de nascimento"
            placeholderTextColor={colors.textOnBase}
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
            style={styleInput(senha, isSenhaInvalida)}
            placeholder="Senha"
            placeholderTextColor={colors.textOnBase}
            secureTextEntry
            value={senha}
            onChangeText={setSenha}
          />

          <Text
            style={{
              color: colors.textOnBase,
              fontSize: fontSizes.small,
              fontStyle: 'italic',
              marginBottom: 3,
            }}>
            A senha deve conter pelo menos:
          </Text>
          {[
            '- 8 caracteres',
            '- 1 letra maiúscula',
            '- 1 letra minúscula',
            '- 1 caracteres especial (@ $ ! % * ? &)',
          ].map((item, index) => (
            <Text
              key={index}
              style={{
                color: colors.textOnBase,
                fontSize: fontSizes.small,
                fontStyle: 'italic',
                marginBottom: index === 3 ? 10 : 0,
              }}>
              {item}
            </Text>
          ))}

          <Text
            style={[
              globalStyles.textJustifiedBoldItalic,
              { color: colors.textOnBase, fontFamily, fontSize: fontSizes.base },
            ]}>
            Confirmar senha:
          </Text>
          <TextInput
            style={styleInput(confirmarSenha, isConfirmacaoInvalida)}
            placeholder="Confirmar senha"
            placeholderTextColor={colors.textOnBase}
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
