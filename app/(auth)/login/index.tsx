// app/(auth)/login/index.tsx
import { ButtonHighlight, ButtonSemiHighlight, HeaderLayout } from '@components/index';
import { logger } from '@lib/logger';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient } from '@services/apiClient';
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

        await AsyncStorage.multiSet([
          ['token', token],
          ['userId', usuario.id],
          ['fontOption', usuario.fontOption],
          ['fontSize', String(usuario.fontSize)],
          ['theme', usuario.theme],
        ]);

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
            />

            <ButtonHighlight title="Entrar" onPress={handleLogin} />
            <ButtonSemiHighlight title="Voltar" onPress={() => router.back()} />

            <View style={stylesLogin.linkContainer}>
              <Text
                style={[
                  globalStyles.textJustified,
                  { color: colors.textOnBase, fontFamily: fontFamily, fontSize: fontSizes.base },
                ]}>
                Ainda não tem uma conta?
              </Text>
              {/* TODO: ajusar estilo e definir rota -> '/(auth)/register' */}
              <Pressable onPress={() => router.push('/(legacy)/user/RegisterUser')}>
                <Text
                  style={{
                    color: colors.textHighlight,
                    fontFamily: fontFamily,
                    fontSize: fontSizes.base,
                  }}>
                  {' '}
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
