// app/(legacy)/user/Login.tsx
import { Header } from '@components/index';
import { logger } from '@lib/logger';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient } from '@services/apiClient';
import styles from '@theme/themOld/globalStyle';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';

const Login: React.FC = () => {
  const router = useRouter();

  const [apelido, setApelido] = useState('');
  const [senha, setSenha] = useState('');

  const handleLogin = async () => {
    if (!apelido || !senha) {
      Toast.show({
        type: 'error',
        text1: 'Preencha todos os campos',
      });
      return;
    }

    const apelidoCorrigido = `@${apelido}`;

    try {
      const response = await apiClient.post('/login', {
        apelido: apelidoCorrigido,
        senha,
      });

      if (response.status === 200) {
        const { token, usuario, msg } = response.data;

        await AsyncStorage.multiSet([
          ['token', token],
          ['userId', usuario.id],
          ['fontOption', usuario.fontOption],
          ['fontSize', String(usuario.fontSize)],
          ['theme', usuario.theme],
        ]);

        Toast.show({
          type: 'success',
          text1: msg,
        });

        router.replace('/boardgame'); // TODO: substituir por rota protegida definitiva
      }
    } catch (error: unknown) {
      logger.error('Erro no login:', error);
      Toast.show({
        type: 'error',
        text1: 'Apelido ou senha incorreta',
        text2: 'Tente novamente.',
      });
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Header title="Login" />
      <View style={styles.container}>
        <Text style={styles.title}>
          Noob <Text style={styles.diceIcon}>🎲</Text>
        </Text>

        <Text style={styles.label}>Apelido:</Text>
        <TextInput
          style={styles.input}
          placeholder="Insira seu nome de usuário"
          value={`@${apelido}`}
          onChangeText={(text) => setApelido(text.replace('@', ''))}
          autoCapitalize="none"
          accessibilityLabel="Campo para inserir o apelido"
          accessibilityHint="Digite seu nome de usuário, começando com arroba"
        />

        <Text style={styles.label}>Senha:</Text>
        <TextInput
          style={styles.input}
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
          placeholder=""
          accessibilityLabel="Campo para inserir a senha"
          accessibilityHint="Digite sua senha. Os caracteres não serão visíveis."
        />

        <TouchableOpacity
          style={styles.buttonPrimary}
          onPress={handleLogin}
          accessibilityLabel="Botão Entrar"
          accessibilityRole="button">
          <Text style={styles.buttonPrimaryText}>Entrar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.buttonSecondary}
          onPress={() => router.back()}
          accessibilityLabel="Botão Voltar"
          accessibilityRole="button">
          <Text style={styles.buttonPrimaryText}>Voltar</Text>
        </TouchableOpacity>

        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={styles.signupText}>Ainda não tem uma conta?</Text>
          {/* TODO: definir rota -> '/(auth)/register' */}
          <TouchableOpacity
            onPress={() => router.push('/(legacy)/user/RegisterUser')}
            accessibilityLabel="Link para cadastrar uma nova conta"
            accessibilityRole="link">
            <Text style={styles.signupLink}> Cadastre-se</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Login;
