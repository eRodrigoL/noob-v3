import { HeaderLayout, ButtonHighlight } from '@components/index';
import { logger } from '@lib/logger';
import { apiClient } from '@services/apiClient';
import { storage } from '@store/storage';
import { globalStyles, useTheme } from '@theme/index';
import { useGameId } from '@hooks/useGameId';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, View, useWindowDimensions, ScrollView } from 'react-native';
import Toast from 'react-native-toast-message';

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
  const id = useGameId();
  const [game, setGame] = useState<Game | null>(null);
  const [avaliacao, setAvaliacao] = useState<Avaliacao>({ beleza: 0, divertimento: 0, duracao: 0, preco: 0, armazenamento: 0, nota: 0 });
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { colors, fontFamily, fontSizes } = useTheme();
  const { width } = useWindowDimensions();

  const calculateAverage = (avaliacao: Avaliacao) => {
    const total = avaliacao.beleza + avaliacao.divertimento + avaliacao.duracao + avaliacao.preco + avaliacao.armazenamento;
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
      setAvaliacao({ beleza: 0, divertimento: 0, duracao: 0, preco: 0, armazenamento: 0, nota: 0 });
    } catch (err) {
      logger.error('Erro ao enviar avaliação:', err);
      Toast.show({ type: 'error', text1: 'Erro ao enviar avaliação' });
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <View style={styles.alertContainer}>
        <Text style={styles.alertIcon}>🔒</Text>
        <Text style={[globalStyles.textCentered, { color: colors.textOnBase, fontFamily, fontSize: fontSizes.large, marginBottom: 12 }]}>
          {error}
        </Text>
        <ButtonHighlight title="Fazer Login" onPress={() => router.push('/login')} />
      </View>
    );
  }

  return (
    <HeaderLayout title="Avaliar Jogo">
      <ScrollView
        style={{ flex: 1, backgroundColor: colors.backgroundBase }}
        contentContainerStyle={{ padding: width > 600 ? '15%' : 16 }}>
        <Text
          style={[globalStyles.textJustifiedBoldItalic, { fontSize: fontSizes.base, fontFamily, color: colors.textOnBase, marginBottom: 12 }]}
        >
          Avalie o jogo {game?.nome} {game?.ano ? `(${game.ano})` : ''}
        </Text>

        {['beleza', 'divertimento', 'duracao', 'preco', 'armazenamento'].map((field) => (
          <View key={field} style={{ marginBottom: 16 }}>
            <Text style={[globalStyles.textJustifiedBoldItalic, { fontSize: fontSizes.base, fontFamily, color: colors.textOnBase }]}> {field[0].toUpperCase() + field.slice(1)}: </Text>
            <TextInput
              keyboardType="numeric"
              value={avaliacao[field as keyof Avaliacao].toString()}
              onChangeText={(val) => handleInputChange(field as keyof Avaliacao, val)}
              style={[globalStyles.input, { fontFamily, fontSize: fontSizes.base, color: colors.textOnBase }]}
            />
          </View>
        ))}

        <Text style={[globalStyles.textJustifiedBoldItalic, { fontSize: fontSizes.base, fontFamily, color: colors.textOnBase }]}>Nota Geral:</Text>
        <Text style={[globalStyles.input, { fontFamily, fontSize: fontSizes.base, color: colors.textOnBase }]}>{avaliacao.nota}</Text>

        <View style={{ marginTop: 24 }}>
          <ButtonHighlight
            accessibilityLabel="Botão Enviar Avaliação"
            title={loading ? 'Enviando...' : 'Enviar Avaliação'}
            onPress={submitReview}
            disabled={loading}
          />
        </View>
      </ScrollView>
    </HeaderLayout>
  );
}

const styles = StyleSheet.create({
  alertContainer: {
    //backgroundColor: '#FFF4E5',
    borderRadius: 12,
    padding: 16,
    margin: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  alertIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  alertText: {
    fontSize: 16,
    color: '#8A6D3B',
    textAlign: 'center',
    marginBottom: 12,
    fontWeight: '500',
  },
  alertButton: {
    backgroundColor: '#FFA726',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
  },
  alertButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
