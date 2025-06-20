// app/(app)/boardgame/[id]/rate.tsx
import { logger } from '@lib/logger';
import { apiClient } from '@services/apiClient';
import { storage } from '@store/storage';
import { Theme } from '@theme/themOld/theme';
import { useGameId } from '@hooks/useGameId';
import React, { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import Toast from 'react-native-toast-message';
import ButtonHighlight from '@components/buttons/ButtonHighlight';

interface Game {
  nome: string;
  ano: string;
}

interface Avaliacao {
  beleza: number;
  divertimento: number;
  duracao: number;
  preco: number;
  armazenamento: number;
  nota: number;
}

export default function GameReview() {
  const id = useGameId(); // ✅ uso padronizado
  const [game, setGame] = useState<Game | null>(null);
  const [avaliacao, setAvaliacao] = useState<Avaliacao>({
    beleza: 0,
    divertimento: 0,
    duracao: 0,
    preco: 0,
    armazenamento: 0,
    nota: 0,
  });
  const [loading, setLoading] = useState(true);

  const calculateAverage = (avaliacao: Avaliacao) => {
    const { beleza, divertimento, duracao, preco, armazenamento } = avaliacao;
    const totalNotas = beleza + divertimento + duracao + preco + armazenamento;
    return Math.floor(totalNotas / 5);
  };

  const validateInput = (text: string, setState: (arg0: string) => void, min = 0, max = 10) => {
    const numericValue = parseInt(text, 10);
    if (!isNaN(numericValue) && numericValue >= min && numericValue <= max) {
      setState(text);
    } else if (text === '') {
      setState('');
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
        const updated = {
          ...prev,
          [field]: Number(validValue),
        };
        return {
          ...updated,
          nota: calculateAverage(updated),
        };
      });
    });
  };

  const fetchGameDetails = async () => {
    if (!id) {
      logger.warn('ID não fornecido');
      return;
    }

    try {
      setLoading(true);
      const response = await apiClient.get(`/jogos/${id}`);
      if (response.data) {
        setGame(response.data);
      } else {
        logger.warn('Jogo não encontrado');
      }
    } catch (error) {
      logger.error('Erro ao buscar o jogo:', error);
      Toast.show({
        type: 'error',
        text1: 'Erro ao buscar jogo',
        text2: 'Verifique sua conexão.',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchGameDetails();
    }
  }, [id]);

  const submitReview = async () => {
    const userId = await storage.getItem('userId');
    const token = await storage.getItem('token');

    if (!userId || !token) {
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: 'Realize o login para avaliar o jogo!',
      });
      return;
    }

    const data = {
      usuario: userId,
      jogo: id, // ✅ Envio correto do id
      ...avaliacao,
    };

    try {
      setLoading(true);
      const response = await apiClient.post('/avaliacoes/', data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

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
      logger.error('Erro ao enviar avaliação:', error);
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: 'Não foi possível enviar a avaliação.',
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Text style={localStyles.label}>Carregando jogo...</Text>;
  }

  if (!game) {
    return <Text style={localStyles.label}>Jogo não encontrado.</Text>;
  }

  return (
    <View style={localStyles.container}>
      <Text style={localStyles.title}>
        Avalie o Jogo{' '}
        <Text style={{ fontWeight: 'bold' }}>
          {game.nome}
          {game.ano && ` (${game.ano})`}
        </Text>
      </Text>

      <Text>Beleza:</Text>
      <TextInput
        style={localStyles.input}
        keyboardType="numeric"
        value={avaliacao.beleza.toString()}
        onChangeText={(value) => handleInputChange('beleza', value)}
      />

      <Text>Divertimento:</Text>
      <TextInput
        style={localStyles.input}
        keyboardType="numeric"
        value={avaliacao.divertimento.toString()}
        onChangeText={(value) => handleInputChange('divertimento', value)}
      />

      <Text>Duração:</Text>
      <TextInput
        style={localStyles.input}
        keyboardType="numeric"
        value={avaliacao.duracao.toString()}
        onChangeText={(value) => handleInputChange('duracao', value)}
      />

      <Text>Preço:</Text>
      <TextInput
        style={localStyles.input}
        keyboardType="numeric"
        value={avaliacao.preco.toString()}
        onChangeText={(value) => handleInputChange('preco', value)}
      />

      <Text>Tamanho da caixa:</Text>
      <TextInput
        style={localStyles.input}
        keyboardType="numeric"
        value={avaliacao.armazenamento.toString()}
        onChangeText={(value) => handleInputChange('armazenamento', value)}
      />

      <Text style={localStyles.label}>Nota Geral:</Text>
      <Text style={localStyles.input}>{avaliacao.nota.toString()}</Text>

      <ButtonHighlight
        title="Enviar Avaliação"
        onPress={submitReview}
        disabled={loading}
        accessibilityLabel="Salvar avaliação do jogo"
        accessibilityHint="Confirma e e envia as notas atribuídas as todos os aspectos do jogo."
      />
    </View>
  );
}

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
    marginVertical: 10,
  },
});

