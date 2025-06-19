// app/(app)/boardgame/[id]/ranking.tsx
import { HeaderLayout, ProfileLayout } from '@components/index';
import { useGameId } from '@hooks/useGameId';
import { logger } from '@lib/logger';
import { apiClient } from '@services/apiClient';
import { storage } from '@store/storage';
import { globalStyles, useTheme } from '@theme/index';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text } from 'react-native';

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = await storage.getItem('token');
        if (!token) {
          setLoading(false);
          return;
        }

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

export default GameRanking;
