// app/(app)/boardgame/[id]/ranking.tsx

// Importações necessárias para o componente, incluindo hooks, serviços, e estilos.
import { ButtonHighlight, HeaderLayout, ProfileLayout } from '@components/index';
import { useGameId } from '@hooks/useGameId';
import { logger } from '@lib/logger';
import { apiClient } from '@services/apiClient';
import { storage } from '@store/storage';
import { globalStyles, useTheme } from '@theme/index';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';

// Tipos usados para organizar os dados do ranking.
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

// Componente principal do ranking do jogo.
const GameRanking = () => {
  const id = useGameId(); // Obtém o ID do jogo atual.
  const { colors, fontFamily, fontSizes } = useTheme(); // Obtém cores, fontes e tamanhos de fontes do tema atual.
  // Estados para gerenciar os dados do ranking e estado da tela.
 const [loading, setLoading] = useState(true); // Indica se os dados estão carregando.
  const [game, setGame] = useState<any>(null); // Armazena os dados do jogo.
  const [mostPlayed, setMostPlayed] = useState<RankingItem[]>([]); // Lista dos jogadores que mais jogaram.
  const [mostWins, setMostWins] = useState<RankingItem[]>([]); // Lista dos jogadores que mais venceram.
  const [topScores, setTopScores] = useState<ScoreItem[]>([]); // Lista das maiores pontuações únicas.
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Indica se o usuário está logado.
  const [error, setError] = useState<string | null>(null); // Mensagem de erro, se houver.
  const styles = useStyles(colors, fontFamily, fontSizes); // Estilos dinamicamente criados.

// Hook para buscar os dados do ranking ao carregar ou mudar o ID do jogo.
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Verifica se o usuário está logado.
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

        // Busca dados das partidas e do jogo simultaneamente.
        const [partidasResponse, gameResponse] = await Promise.all([
          apiClient.get<Partida[]>('/partidas', config),
          apiClient.get(`/jogos/${id}`),
        ]);

        // Filtra apenas as partidas relacionadas ao jogo atual.
        setGame(gameResponse.data);
        const partidas = partidasResponse.data.filter((p) => p.jogo === id);

        // Mapas para acumular os dados de jogadas, vitórias e pontuações.
        const playCountMap: Record<string, number> = {};
        const winCountMap: Record<string, number> = {};
        const topScoreMap: Record<string, number> = {};

        // Processa os dados das partidas para preencher os mapas.
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

        // Converte os mapas em listas ordenadas para exibição.
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

        setMostPlayed(toRanking(playCountMap)); // Define os jogadores mais ativos.
        setMostWins(toRanking(winCountMap)); // Define os jogadores com mais vitórias.
        setTopScores(toScoreRanking(topScoreMap)); // Define as maiores pontuações únicas.
      } catch (error) {
        logger.error('Erro ao buscar ranking:', error); // Loga erros durante a requisição.
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  // Renderiza uma lista de ranking (mais jogaram ou venceram).
  const renderRanking = (lista: RankingItem[], nome: string) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{nome}</Text>
      {lista.map((item, index) => (
        <Text key={index} style={styles.rankingItem}>
          {index + 1}. {item.apelido}: {item.count} vez(es)
        </Text>
      ))}
    </View>
  );

  // Renderiza uma lista de pontuações.
  const renderScores = (lista: ScoreItem[], nome: string) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{nome}</Text>
      {lista.map((item, index) => (
        <Text key={index} style={styles.rankingItem}>
          {index + 1}. {item.apelido}: {item.score} pontos
        </Text>
      ))}
    </View>
  );


  // Renderiza a interface principal do componente.
  return (
    <HeaderLayout title="Ranking">
      <ProfileLayout
        id={game?._id}
        name={game?.nome}
        photo={game?.foto}
        isLoading={loading}
        isUser={false}>
        {loading ? (
          // Exibe um indicador de carregamento enquanto os dados são obtidos.
          <ActivityIndicator size="large" color={colors.backgroundHighlight} />
        ) : error ? ( // Exibe uma mensagem de erro, se necessário.
          <View style={styles.alertContainer}>
            <Text style={styles.alertIcon}>🔒</Text>
            <Text
              style={[
                globalStyles.textCentered,
                {
                  color: colors.textOnBase,
                  fontFamily,
                  fontSize: fontSizes.large,
                  marginBottom: 12,
                },
              ]}>
              {error}
            </Text>
            <ButtonHighlight title={'Fazer Login'} onPress={() => router.push("/login")} />
          </View>
        ) : mostPlayed.length === 0 && mostWins.length === 0 && topScores.length === 0 ? (
          <View style={styles.alertContainer}>
            <Text style={[globalStyles.textCenteredBold, { fontSize: 48, fontFamily, marginBottom: 12 }]}>
              📉
            </Text>
            <Text
              style={{
                textAlign: 'center',
                fontSize: 16,
                color: colors.textOnBase,
                fontFamily,
                marginBottom: 16,
              }}>
              Ainda não há dados suficientes para gerar um ranking. Registre partidas para começar!
            </Text>
            <ButtonHighlight title="Ir para partidas" onPress={() => router.push('/(app)/matches/matchStart')} />
          </View>
        ) : (

          // Renderiza as listas de ranking e pontuações.
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
            showsVerticalScrollIndicator={false}>
            {renderRanking(mostPlayed, 'Top Jogadores (Mais partidas)')}
            {renderRanking(mostWins, 'Top Vencedores')}
            {renderScores(topScores, 'Maiores pontuações únicas')}
          </ScrollView>

        )}

      </ProfileLayout>
    </HeaderLayout>
  );
};

// Estilos dinâmicos para o componente.
const useStyles = (colors: any, fontFamily: string, fontSizes: any) =>
  StyleSheet.create({

    alertContainer: {
      borderRadius: 12,
      padding: 16,
      margin: 20,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.surfaceBase,
    },
    alertIcon: {
      fontSize: 32,
      marginBottom: 8,
    },
    section: {
      backgroundColor: colors.surfaceVariant,
      borderRadius: 12,
      padding: 16,
      marginBottom: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 2,
    },
    sectionTitle: {
      fontSize: fontSizes.large,
      fontFamily,
      fontWeight: '600',
      color: colors.textOnBase,
      marginBottom: 12,
      textAlign: 'center',
    },
    rankingItem: {
      fontSize: fontSizes.base,
      fontFamily,
      color: colors.textOnBase,
      marginVertical: 4,
    },
  });



export default GameRanking;
