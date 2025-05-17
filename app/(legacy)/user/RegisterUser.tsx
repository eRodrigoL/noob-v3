// app/(legacy)/user/RegisterUser.tsx
import { Header } from '@components/index';
import { logger } from '@lib/logger';
import { apiClient } from '@services/apiClient';
import styles from '@theme/themOld/globalStyle';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { TextInputMask } from 'react-native-masked-text';
import Toast from 'react-native-toast-message';

const RegisterUser: React.FC = () => {
  const router = useRouter();

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
        router.replace('/(legacy)/user/Login'); // TODO: substituir por /(auth)/login
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
      <Header title="Registro de usuário" />
      <ScrollView>
        <View style={styles.container}>
          <Text style={styles.title}>Crie sua conta:</Text>

          <TouchableOpacity
            onPress={() => pickImage(setImageUri)}
            style={styles.profileImageContainer}>
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.profileImage} />
            ) : (
              <Text style={styles.profileImagePlaceholder}>Adicionar Foto</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => pickImage(setCapaUri)}
            style={styles.profileImageContainer}>
            {capaUri ? (
              <Image source={{ uri: capaUri }} style={styles.profileImage} />
            ) : (
              <Text style={styles.profileImagePlaceholder}>Adicionar Capa</Text>
            )}
          </TouchableOpacity>

          <TextInput style={styles.input} placeholder="Nome" value={nome} onChangeText={setNome} />

          <TextInput
            style={styles.input}
            placeholder="Apelido"
            value={`@${apelido}`}
            onChangeText={(text) => setApelido(text.replace('@', ''))}
            autoCapitalize="none"
          />

          <TextInputMask
            style={styles.input}
            type="datetime"
            options={{ format: 'DD/MM/YYYY' }}
            placeholder="Data de nascimento"
            value={nascimento}
            onChangeText={setNascimento}
          />

          <TextInput
            style={styles.input}
            placeholder="Email"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />

          <TextInput
            style={styles.input}
            placeholder="Senha"
            secureTextEntry
            value={senha}
            onChangeText={setSenha}
          />

          <TextInput
            style={styles.input}
            placeholder="Confirmar senha"
            secureTextEntry
            value={confirmarSenha}
            onChangeText={setConfirmarSenha}
          />

          <TouchableOpacity style={styles.buttonPrimary} onPress={handleRegister}>
            <Text style={styles.buttonPrimaryText}>Cadastrar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.buttonSecondary}
            onPress={() => router.replace('/(legacy)/boardgameOld')}>
            <Text style={styles.buttonPrimaryText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default RegisterUser;
