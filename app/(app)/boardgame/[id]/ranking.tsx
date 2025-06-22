// app/(app)/boardgame/[id]/ranking.tsx
import { ButtonHighlight, HeaderLayout, ProfileLayout } from '@components/index';
import { useGameId } from '@hooks/useGameId';
import { logger } from '@lib/logger';
import { apiClient } from '@services/apiClient';
import { storage } from '@store/storage';
import { globalStyles, useTheme } from '@theme/index';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text } from 'react-native';
import { StyleSheet, View, TouchableOpacity } from 'react-native';

interface Partida {
  _id: string;
  usuarios: { apelido: string; _id: string }[];
  vencedor: { apelido: string; _id: string }[];
  pontuacao: number;
  jogo: string;
}

interface RankingItem {
  apelido: string;
  count: number;
}

interface ScoreItem {
  apelido: string;
  score: number;
}

const GameRanking = () => {
  const id = useGameId();
  const { colors, fontFamily, fontSizes } = useTheme();
  const [loading, setLoading] = useState(true);
  const [game, setGame] = useState<any>(null);
  const [mostPlayed, setMostPlayed] = useState<RankingItem[]>([]);
  const [mostWins, setMostWins] = useState<RankingItem[]>([]);
  const [topScores, setTopScores] = useState<ScoreItem[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = await storage.getItem('token');
        if (!token) {
          setIsLoggedIn(false);
          setError('Realize o login para ver o ranking deste jogo.');
          setLoading(false);
          return;
        }

        setIsLoggedIn(true);


        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };

        const [partidasResponse, gameResponse] = await Promise.all([
          apiClient.get<Partida[]>('/partidas', config),
          apiClient.get(`/jogos/${id}`),
        ]);

        setGame(gameResponse.data);
        const partidas = partidasResponse.data.filter((p) => p.jogo === id);

        const playCountMap: Record<string, number> = {};
        const winCountMap: Record<string, number> = {};
        const topScoreMap: Record<string, number> = {};

        partidas.forEach((partida) => {
          partida.usuarios.forEach((u) => {
            playCountMap[u.apelido] = (playCountMap[u.apelido] || 0) + 1;
          });

          partida.vencedor.forEach((v) => {
            winCountMap[v.apelido] = (winCountMap[v.apelido] || 0) + 1;
          });

          partida.usuarios.forEach((u) => {
            if (!(u.apelido in topScoreMap) || partida.pontuacao > topScoreMap[u.apelido]) {
              topScoreMap[u.apelido] = partida.pontuacao;
            }
          });
        });

        const toRanking = (map: Record<string, number>): RankingItem[] =>
          Object.entries(map)
            .map(([apelido, count]) => ({ apelido, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 15);

        const toScoreRanking = (map: Record<string, number>): ScoreItem[] =>
          Object.entries(map)
            .map(([apelido, score]) => ({ apelido, score }))
            .sort((a, b) => b.score - a.score)
            .slice(0, 15);

        setMostPlayed(toRanking(playCountMap));
        setMostWins(toRanking(winCountMap));
        setTopScores(toScoreRanking(topScoreMap));
      } catch (error) {
        logger.error('Erro ao buscar ranking:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  const renderRanking = (lista: RankingItem[], nome: string) => (
    <>
      <Text style={[globalStyles.textCenteredBold, { fontSize: fontSizes.large, fontFamily }]}>
        {nome}
      </Text>
      {lista.map((item, index) => (
        <Text
          key={index}
          style={{
            fontSize: fontSizes.base,
            fontFamily,
            color: colors.textOnBase,
            marginVertical: 4,
          }}>
          {index + 1}. {item.apelido}: {item.count} vez(es)
        </Text>
      ))}
    </>
  );

  const renderScores = (lista: ScoreItem[], nome: string) => (
    <>
      <Text style={[globalStyles.textCenteredBold, { fontSize: fontSizes.large, fontFamily }]}>
        {nome}
      </Text>
      {lista.map((item, index) => (
        <Text
          key={index}
          style={{
            fontSize: fontSizes.base,
            fontFamily,
            color: colors.textOnBase,
            marginVertical: 4,
          }}>
          {index + 1}. {item.apelido}: {item.score} pontos
        </Text>
      ))}
    </>
  );

  return (
    <HeaderLayout title="Ranking">
      <ProfileLayout
        id={game?._id}
        name={game?.nome}
        photo={game?.foto}
        isLoading={loading}
        isUser={false}>
        {loading ? (
          <ActivityIndicator size="large" color={colors.backgroundHighlight} />
        ) : error ? (
          <View style={styles.alertContainer}>
            <Text style={styles.alertIcon}>🔒</Text>
            <Text style={[
              globalStyles.textCentered,
              { color: colors.textOnBase, fontFamily, fontSize: fontSizes.large },
            ]}>{error}</Text>
            <ButtonHighlight title={'Fazer Login'} onPress={() => router.push("/login")}>
            </ButtonHighlight>
          </View>
        ) : (
          <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
            {renderRanking(mostPlayed, 'Top Jogadores (Mais partidas)')}
            {renderRanking(mostWins, 'Top Vencedores')}
            {renderScores(topScores, 'Maiores pontuações únicas')}
          </ScrollView>
        )}
      </ProfileLayout>
    </HeaderLayout>
  );
};

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


export default GameRanking;
