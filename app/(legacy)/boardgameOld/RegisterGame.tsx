// app/(legacy)/boardgameOld/RegisterGame.tsx
import ButtonGoBack from '@components/ButtonGoBack';
import ButtonHighlight from '@components/buttons/ButtonHighlight';
import { apiClient } from '@services/apiClient';
import styles from '@theme/themOld/globalStyle';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { storage } from '@store/storage';

const RegisterGame: React.FC = () => {
  // Estados para armazenar os dados do jogo
  const [titulo, setTitulo] = useState('');
  const [ano, setAno] = useState('');
  const [idade, setIdade] = useState('');
  const [designer, setDesigner] = useState('');
  const [artista, setArtista] = useState('');
  const [editora, setEditora] = useState('');
  const [digital, setDigital] = useState('');
  const [categoria, setCategoria] = useState('');
  const [componentes, setComponentes] = useState('');
  const [descricao, setDescricao] = useState('');
  const [idOriginal, setIdOriginal] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null); // Foto
  const [capaUri, setCapaUri] = useState<string | null>(null); // Capa

  const router = useRouter();

  // Função responsável por abrir a galeria de imagens para escolher a foto
  const pickImage = async (
    setImageCallback: React.Dispatch<React.SetStateAction<string | null>>
  ) => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: 'Permissão para acessar as fotos é necessária!',
      });
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      setImageCallback(result.assets[0].uri);
    }
  };

  // Função que lida com o cadastro do jogo
  const gameRegister = async () => {
    if (!titulo) {
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: 'O campo "Título" é obrigatório.',
      });
      return;
    }

    try {
      const userId = await storage.getItem('userId');
      const token = await storage.getItem('token');

      if (!userId || !token) {
        Toast.show({
          type: 'error',
          text1: 'Erro',
          text2: 'ID do usuário ou token não encontrados.',
        });
        return;
      }

      // Cria um FormData para o envio dos dados
      const formData = new FormData();
      formData.append('titulo', titulo);
      formData.append('ano', ano);
      formData.append('idade', idade);
      formData.append('designer', designer);
      formData.append('artista', artista);
      formData.append('editora', editora);
      formData.append('digital', digital);
      formData.append('categoria', categoria);
      formData.append('componentes', componentes);
      formData.append('descricao', descricao);
      formData.append('idOriginal', idOriginal);

      // Adiciona a foto e a capa no FormData, caso tenham sido escolhidas
      if (imageUri) {
        const filename = imageUri.split('/').pop();
        const match = /\.(\w+)$/.exec(filename ?? '');
        const fileType = match ? `image/${match[1]}` : `image`;
        formData.append('foto', {
          uri: imageUri,
          name: filename,
          type: fileType,
        } as any);
      }

      if (capaUri) {
        const filename = capaUri.split('/').pop();
        const match = /\.(\w+)$/.exec(filename ?? '');
        const fileType = match ? `image/${match[1]}` : `image`;
        formData.append('capa', {
          uri: capaUri,
          name: filename,
          type: fileType,
        } as any);
      }

      // Envia a requisição com os dados para o backend
      const response = await apiClient.post('api/jogos', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 201) {
        const message = response.data.msg;
        Toast.show({
          type: 'success',
          text1: 'Secesso',
          text2: message,
        });
        //router.push("/success"); // Redireciona para uma página de sucesso
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: 'Houve um erro ao criar o jogo. Tente novamente!',
      });
    }
  };

  return (
    <View>
      <ScrollView>
        <View style={styles.container}>
          <ButtonGoBack />
          <View style={{ width: 100, height: 70 }}></View>
          <Text style={styles.title}>Registrar Jogo:</Text>

          {/* Selecionar a foto */}
          <TouchableOpacity
            onPress={() => pickImage(setImageUri)}
            style={styles.profileImageContainer}>
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.profileImage} />
            ) : (
              <Text style={styles.profileImagePlaceholder}>Adicionar Foto</Text>
            )}
          </TouchableOpacity>

          {/* Selecionar a capa */}
          <TouchableOpacity
            onPress={() => pickImage(setCapaUri)}
            style={styles.profileImageContainer}>
            {capaUri ? (
              <Image source={{ uri: capaUri }} style={styles.profileImage} />
            ) : (
              <Text style={styles.profileImagePlaceholder}>Adicionar Capa</Text>
            )}
          </TouchableOpacity>

          {/* Campos de entrada do jogo */}
          <TextInput
            style={styles.input}
            placeholder="Título (obrigatório)"
            value={titulo}
            onChangeText={setTitulo}
          />
          <TextInput style={styles.input} placeholder="Ano" value={ano} onChangeText={setAno} />
          <TextInput
            style={styles.input}
            placeholder="Idade"
            keyboardType="numeric"
            value={idade}
            onChangeText={setIdade}
          />
          <TextInput
            style={styles.input}
            placeholder="Designer"
            value={designer}
            onChangeText={setDesigner}
          />
          <TextInput
            style={styles.input}
            placeholder="Artista"
            value={artista}
            onChangeText={setArtista}
          />
          <TextInput
            style={styles.input}
            placeholder="Editora"
            value={editora}
            onChangeText={setEditora}
          />
          <TextInput
            style={styles.input}
            placeholder="Digital"
            value={digital}
            onChangeText={setDigital}
          />
          <TextInput
            style={styles.input}
            placeholder="Categoria"
            value={categoria}
            onChangeText={setCategoria}
          />
          <TextInput
            style={styles.input}
            placeholder="Componentes"
            value={componentes}
            onChangeText={setComponentes}
          />
          <TextInput
            style={styles.input}
            placeholder="Descrição"
            value={descricao}
            onChangeText={setDescricao}
          />
          <TextInput
            style={styles.input}
            placeholder="ID Original"
            value={idOriginal}
            onChangeText={setIdOriginal}
          />

          {/* Botão para cadastrar o jogo */}
          <ButtonHighlight title="Cadastrar Jogo" onPress={gameRegister} />
        </View>
      </ScrollView>
    </View>
  );
};

export default RegisterGame;
