// app/(auth)/login/index.tsx
import { ButtonHighlight, ButtonSemiHighlight, HeaderLayout } from '@components/index';
import { logger } from '@lib/logger';
import { apiClient } from '@services/apiClient';
import { storage } from '@store/storage';
import { globalStyles, useTheme } from '@theme/index';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, Text, TextInput, useWindowDimensions, View } from 'react-native';
import Toast from 'react-native-toast-message';
import stylesLogin from './styles';

const Login: React.FC = () => {
  const router = useRouter();
  const { colors, fontSizes, fontFamily } = useTheme();
  const { width } = useWindowDimensions();
  const isWideScreen = width > 480;

  const [apelido, setApelido] = useState('');
  const [senha, setSenha] = useState('');

  const handleLogin = async () => {
    if (!apelido || !senha) {
      Toast.show({ type: 'error', text1: 'Preencha todos os campos' });
      return;
    }

    const apelidoCorrigido = `@${apelido}`;

    try {
      const response = await apiClient.post('/login', { apelido: apelidoCorrigido, senha });

      if (response.status === 200) {
        const { token, usuario, msg } = response.data;

        await storage.setItem('token', token);
        await storage.setItem('userId', usuario.id);
        await storage.setItem('fontOption', usuario.fontOption);
        await storage.setItem('fontSize', String(usuario.fontSize));
        await storage.setItem('fontSize', String(usuario.fontSize));
        await storage.setItem('theme', usuario.theme);

        Toast.show({ type: 'success', text1: msg });

        router.replace('/boardgame');
      }
    } catch (error: unknown) {
      logger.error('Erro no login:', error);
      Toast.show({ type: 'error', text1: 'Apelido ou senha incorreta', text2: 'Tente novamente.' });
    }
  };

  return (
    <View style={[globalStyles.container, { backgroundColor: colors.backgroundBase }]}>
      <HeaderLayout title="Login">
        <View style={stylesLogin.wrapperCenter}>
          <View
            style={[
              stylesLogin.contentBox,
              {
                borderWidth: isWideScreen ? 1 : 0,
                borderColor: colors.border,
                backgroundColor: colors.backgroundBase,
              },
            ]}>
            <Text
              style={[
                globalStyles.textCenteredBold,
                {
                  color: colors.textOnBase,
                  fontFamily: fontFamily,
                  fontSize: fontSizes.giant,
                  paddingBottom: 15,
                },
              ]}>
              Noob 🎲
            </Text>

            <Text
              style={[
                globalStyles.textJustified,
                { color: colors.textOnBase, fontFamily: fontFamily, fontSize: fontSizes.base },
              ]}>
              Apelido:
            </Text>
            <TextInput
              style={[
                globalStyles.input,
                {
                  borderColor: colors.border,
                  borderWidth: 1,
                  color: colors.textOnBase,
                  fontFamily: fontFamily,
                  fontSize: fontSizes.base,
                },
              ]}
              placeholder="Insira seu nome de usuário"
              value={`@${apelido}`}
              onChangeText={(text) => setApelido(text.replace('@', ''))}
              autoCapitalize="none"
              accessibilityLabel="Campo para inserir o apelido"
              accessibilityHint="Digite seu nome de usuário, começando com arroba"
            />

            <Text
              style={[
                globalStyles.textJustified,
                { color: colors.textOnBase, fontFamily: fontFamily, fontSize: fontSizes.base },
              ]}>
              Senha:
            </Text>
            <TextInput
              style={[
                globalStyles.input,
                {
                  borderColor: colors.border,
                  borderWidth: 1,
                  color: colors.textOnBase,
                  fontFamily: fontFamily,
                  fontSize: fontSizes.base,
                },
              ]}
              secureTextEntry
              value={senha}
              onChangeText={setSenha}
              placeholder=""
              accessibilityLabel="Campo para inserir a senha"
              accessibilityHint="Digite sua senha. Os caracteres não serão visíveis."
            />

            <ButtonHighlight
              title="Entrar"
              onPress={handleLogin}
              accessibilityLabel="Botão Entrar"
              accessibilityRole="button"
            />
            <ButtonSemiHighlight
              title="Voltar"
              onPress={() => router.back()}
              accessibilityLabel="Botão Voltar"
              accessibilityRole="button"
            />

            <View style={stylesLogin.linkContainer}>
              <Text
                style={[
                  globalStyles.textJustified,
                  { color: colors.textOnBase, fontFamily: fontFamily, fontSize: fontSizes.base },
                ]}>
                {'Ainda não tem uma conta? '}
              </Text>
              <Pressable
                onPress={() => router.push('/registerUser')}
                accessibilityLabel="Link para cadastrar uma nova conta"
                accessibilityRole="link">
                <Text
                  style={{
                    color: colors.textHighlight,
                    fontFamily: fontFamily,
                    fontSize: fontSizes.base,
                  }}>
                  Cadastre-se
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </HeaderLayout>
    </View>
  );
};

export default Login;
