import { logger } from '@lib/logger';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient } from '@services/apiClient';
import { Theme } from '@theme/themOld/theme';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import Toast from 'react-native-toast-message';

interface Game {
  titulo: string;
  ano: string;
}

// Define o tipo para os dados da avaliação
interface Avaliacao {
  beleza: number;
  divertimento: number;
  duracao: number;
  preco: number;
  armazenamento: number;
  nota: number;
}

export default function GameReview() {
  const { id: jogo } = useLocalSearchParams<{ id?: string }>();
  const [game, setGame] = useState<Game | null>(null);
  const [avaliacao, setAvaliacao] = useState<Avaliacao>({
    beleza: 0,
    divertimento: 0,
    duracao: 0,
    preco: 0,
    armazenamento: 0,
    nota: 0,
  });
  const [loading, setLoading] = useState(false);

  // Função para calcular a média
  const calculateAverage = (avaliacao: Avaliacao) => {
    const { beleza, divertimento, duracao, preco, armazenamento } = avaliacao;
    const totalNotas = beleza + divertimento + duracao + preco + armazenamento;
    const numberOfFields = 5; // Número de campos que estão sendo avaliados
    return Math.floor(totalNotas / numberOfFields); // Retorna a média inteira
  };

  const validateInput = (text: string, setState: (arg0: string) => void, min = 0, max = 10) => {
    const numericValue = parseInt(text, 10);

    if (!isNaN(numericValue) && numericValue >= min && numericValue <= max) {
      setState(text); // Atualiza o estado se o valor for válido
    } else if (text === '') {
      setState(''); // Permite limpar o campo
    } else {
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: `Por favor, insira um valor entre ${min} e ${max}.`,
      });
    }
  };

  const handleInputChange = (field: keyof Avaliacao, value: string) => {
    validateInput(value, (validValue) => {
      setAvaliacao((prev) => {
        const updatedAvaliacao = {
          ...prev,
          [field]: Number(validValue),
        };

        // Atualiza a nota geral ao calcular a média
        return {
          ...updatedAvaliacao,
          nota: calculateAverage(updatedAvaliacao),
        };
      });
    });
  };
  // Função para buscar os dados completos do jogo usando o ID
  const fetchGameDetails = async () => {
    if (!jogo) {
      logger.warn('ID não fornecido!'); // Aviso para id ausente
      return;
    }

    try {
      const response = await apiClient.get(`/jogos/${jogo}`);

      if (response.data) {
        setGame(response.data);
      } else {
        logger.warn('Nenhum dado encontrado para este ID.');
      }
    } catch (error) {
      logger.error('Erro ao buscar os dados do jogo:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGameDetails();
  }, [jogo]);

  if (loading) {
    return <Text>Carregando...</Text>;
  }

  if (!game) {
    return <Text>Jogo não encontrado.</Text>;
  }

  // Função para enviar a avaliação para o banco de dados
  const submitReview = async () => {
    const userId = await AsyncStorage.getItem('userId');
    const token = await AsyncStorage.getItem('token');

    if (!userId || !token) {
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: 'Realize o login para avaliar o jogo!',
      });
      return;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };

    const data = {
      usuario: userId,
      jogo,
      ...avaliacao,
    };

    setLoading(true);

    try {
      const response = await apiClient.post('/avaliacoes/', data, config);
      if (response.status === 201) {
        Toast.show({
          type: 'success',
          text1: 'Sucesso',
          text2: 'Avaliação enviada com sucesso!',
        });
        setAvaliacao({
          beleza: 0,
          divertimento: 0,
          duracao: 0,
          preco: 0,
          armazenamento: 0,
          nota: 0,
        });
      }
    } catch (error) {
      logger.error('Erro ao enviar a avaliação:', error);
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: 'Não foi possível enviar a avaliação.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={localStyles.container}>
      <Text style={localStyles.title}>
        Avalie o Jogo <Text style={{ fontWeight: 'bold' }}>{game.titulo}</Text> de
        {game.ano && game.ano !== '' && <Text style={{ fontWeight: 'bold' }}> ({game.ano})</Text>}
      </Text>
      <Text>Beleza:</Text>
      <TextInput
        style={localStyles.input}
        placeholder="Beleza"
        keyboardType="numeric"
        value={avaliacao.beleza.toString()}
        onChangeText={(value) => handleInputChange('beleza', value)}
      />
      <Text>Divertimento:</Text>
      <TextInput
        style={localStyles.input}
        placeholder="Divertimento"
        keyboardType="numeric"
        value={avaliacao.divertimento.toString()}
        onChangeText={(value) => handleInputChange('divertimento', value)}
      />
      <Text>Duração:</Text>
      <TextInput
        style={localStyles.input}
        placeholder="Duração"
        keyboardType="numeric"
        value={avaliacao.duracao.toString()}
        onChangeText={(value) => handleInputChange('duracao', value)}
      />
      <Text>Preço:</Text>
      <TextInput
        style={localStyles.input}
        placeholder="Preço"
        keyboardType="numeric"
        value={avaliacao.preco.toString()}
        onChangeText={(value) => handleInputChange('preco', value)}
      />
      <Text>Tamanho da caixa:</Text>
      <TextInput
        style={localStyles.input}
        placeholder="Armazenamento"
        keyboardType="numeric"
        value={avaliacao.armazenamento.toString()}
        onChangeText={(value) => handleInputChange('armazenamento', value)}
      />

      {/* Campo para mostrar a Nota Geral */}
      <Text style={localStyles.label}>Nota Geral:</Text>
      <Text style={localStyles.input}>{avaliacao.nota.toString()}</Text>

      <Button color="#FF8C00" title="Enviar Avaliação" onPress={submitReview} disabled={loading} />
    </View>
  );
}

// Estilos para a página de avaliação
const localStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: Theme.light.background,
  },
  title: {
    fontSize: 24,
    color: Theme.light.text,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: Theme.light.text,
    borderRadius: 8,
    padding: 10,
    marginVertical: 5,
    fontSize: 18,
    color: Theme.light.text,
  },
  label: {
    fontSize: 18,
    color: Theme.light.text,
    marginVertical: 5,
  },
});
