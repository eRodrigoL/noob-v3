import {
  ButtonHighlight,
  HeaderLayout,
  ProfileLayout,
} from '@components/index';
import { logger } from '@lib/logger';
import { apiClient } from '@services/apiClient';
import { storage } from '@store/storage';
import { globalStyles, useTheme } from '@theme/index';
import { useGameId } from '@hooks/useGameId';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import Toast from 'react-native-toast-message';

interface Game {
  _id: string;
  nome: string;
  ano: string;
  foto?: string;
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
  const id = useGameId();
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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { colors, fontFamily, fontSizes } = useTheme();

  const calculateAverage = (avaliacao: Avaliacao) => {
    const total =
      avaliacao.beleza +
      avaliacao.divertimento +
      avaliacao.duracao +
      avaliacao.preco +
      avaliacao.armazenamento;
    return Math.floor(total / 5);
  };

  const handleInputChange = (field: keyof Avaliacao, value: string) => {
    const numeric = parseInt(value);
    if (!isNaN(numeric) && numeric >= 0 && numeric <= 10) {
      setAvaliacao((prev) => {
        const updated = { ...prev, [field]: numeric };
        return { ...updated, nota: calculateAverage(updated) };
      });
    } else {
      Toast.show({ type: 'error', text1: 'Insira um valor entre 0 e 10' });
    }
  };

  const fetchGameDetails = async () => {
    try {
      const response = await apiClient.get(`/jogos/${id}`);
      if (response.data) setGame(response.data);
    } catch (err) {
      logger.error('Erro ao buscar jogo:', err);
      Toast.show({ type: 'error', text1: 'Erro ao carregar jogo' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const checkLogin = async () => {
      const token = await storage.getItem('token');
      if (!token) {
        setIsLoggedIn(false);
        setError('Realize o login para avaliar o jogo.');
        setLoading(false);
      } else {
        setIsLoggedIn(true);
        fetchGameDetails();
      }
    };
    if (id) checkLogin();
  }, [id]);

  const submitReview = async () => {
    const token = await storage.getItem('token');
    const userId = await storage.getItem('userId');
    if (!token || !userId) {
      Toast.show({ type: 'error', text1: 'Login necessário' });
      return;
    }
    try {
      setLoading(true);
      await apiClient.post(
        '/avaliacoes/',
        { usuario: userId, jogo: id, ...avaliacao },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Toast.show({ type: 'success', text1: 'Avaliação enviada com sucesso' });
      setAvaliacao({
        beleza: 0,
        divertimento: 0,
        duracao: 0,
        preco: 0,
        armazenamento: 0,
        nota: 0,
      });
    } catch (err) {
      logger.error('Erro ao enviar avaliação:', err);
      Toast.show({ type: 'error', text1: 'Erro ao enviar avaliação' });
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <HeaderLayout title="Avaliar Jogo">
        <View style={{ padding: 24, alignItems: 'center', justifyContent: 'center' }}>
          <Text
            style={{
              fontSize: fontSizes.large,
              fontFamily,
              color: colors.textOnBase,
              textAlign: 'center',
              marginBottom: 12,
            }}>
            🔒 {error}
          </Text>
          <ButtonHighlight title="Fazer Login" onPress={() => router.push('/login')} />
        </View>
      </HeaderLayout>
    );
  }

  if (!game) {
    return (
      <HeaderLayout title="Avaliar Jogo">
        <ProfileLayout isUser={false} isLoading />
      </HeaderLayout>
    );
  }

  const renderField = (label: string, field: keyof Avaliacao) => (
    <View style={{ marginBottom: 16 }}>
      <Text
        style={{
          fontFamily,
          fontSize: fontSizes.base,
          color: colors.textOnBase,
          marginBottom: 4,
        }}>
        {label}
      </Text>
      <TextInput
        keyboardType="numeric"
        value={avaliacao[field].toString()}
        onChangeText={(val) => handleInputChange(field, val)}
        style={[
          globalStyles.input,
          { fontFamily, fontSize: fontSizes.base, color: colors.textOnBase },
        ]}
      />
    </View>
  );

  return (
    <HeaderLayout title="Avaliar Jogo">
      <ProfileLayout
        id={game._id}
        name={game.nome}
        photo={game.foto}
        cover={null}
        isUser={false}
        isLoading={loading}>
        <Text
          style={{
            fontFamily,
            fontSize: fontSizes.base,
            color: colors.textOnBase,
            marginBottom: 16,
          }}>
          Avalie o jogo {game.nome} {game.ano ? `(${game.ano})` : ''}
        </Text>

        {renderField('Beleza', 'beleza')}
        {renderField('Divertimento', 'divertimento')}
        {renderField('Duração', 'duracao')}
        {renderField('Preço', 'preco')}
        {renderField('Armazenamento', 'armazenamento')}

        <Text
          style={{
            fontFamily,
            fontSize: fontSizes.base,
            color: colors.textOnBase,
            marginBottom: 8,
          }}>
          Nota Geral:
        </Text>
        <Text
          style={[
            globalStyles.input,
            {
              fontFamily,
              fontSize: fontSizes.base,
              color: colors.textOnBase,
              marginBottom: 24,
            },
          ]}>
          {avaliacao.nota}
        </Text>

        <ButtonHighlight
          title={loading ? 'Enviando...' : 'Enviar Avaliação'}
          onPress={submitReview}
          disabled={loading}
        />
      </ProfileLayout>
    </HeaderLayout>
  );
}
