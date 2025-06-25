// app/(app)/boardgame/[id]/review.tsx
import { ButtonHighlight, HeaderLayout, ProfileLayout } from '@components/index';
import { useGameId } from '@hooks/useGameId';
import { logger } from '@lib/logger';
import { apiClient } from '@services/apiClient';
import { storage } from '@store/storage';
import { globalStyles, useTheme } from '@theme/index';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Circle, Line, Polygon, Svg, Text as SvgText } from 'react-native-svg';


export default function GameReview() {
  const id = useGameId();
  const [game, setGame] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { colors, fontFamily, fontSizes } = useTheme();
  const [data, setData] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [averageRating, setAverageRating] = useState<number | null>(null);
  const [playCount, setPlayCount] = useState<number | null>(null);
  const [matchesByDate, setMatchesByDate] = useState<Record<string, number>>({});

  const categories = ['Beleza', 'Divertimento', 'Duração', 'Preço', 'Armazenamento'];
  const maxValue = 100;
  const chartSize = 250;
  const margin = 70;
  const svgSize = chartSize + margin * 2;
  const radius = chartSize / 2;

  const calculateCoordinates = (value: number, index: number, total: number) => {
    const angle = (Math.PI * 2 * index) / total;
    const distance = (value / maxValue) * radius;
    const x = margin + radius + distance * Math.sin(angle);
    const y = margin + radius - distance * Math.cos(angle);
    return { x, y };
  };

  const points = data
    .map((value, index) => {
      const { x, y } = calculateCoordinates(value, index, data.length);
      return `${x},${y}`;
    })
    .join(' ');

  const fetchGameAndData = async () => {
    try {
      setLoading(true);
      const token = await storage.getItem('token');
      const userId = await storage.getItem('userId');
      const loggedIn = !!token;
      setIsLoggedIn(loggedIn);

      const gameResponse = await apiClient.get(`/jogos/${id}`);
      setGame(gameResponse.data);

      // 🔓 Requisição pública (avaliacoes)
      const evaluationsResponse = await apiClient.get(`/avaliacoes/`);
      const evaluations = evaluationsResponse.data.filter((e: any) => e.jogo === id);

      if (evaluations.length === 0) {
        setData([]);
        setError('Nenhuma avaliação encontrada para este jogo.');
        return;
      }

      const mapKey: { [k: string]: keyof (typeof evaluations)[0] } = {
        Beleza: 'beleza',
        Divertimento: 'divertimento',
        Duração: 'duracao',
        Preço: 'preco',
        Armazenamento: 'armazenamento',
      };

      const averages = categories.map((cat) => {
        const field = mapKey[cat];
        const sum = evaluations.reduce((acc: number, cur: any) => acc + (cur[field] || 0), 0);
        return evaluations.length ? sum / evaluations.length : 0;
      });

      const avgScore =
        evaluations.reduce((acc: number, cur: any) => acc + (cur.nota || 0), 0) / evaluations.length;

      setData(averages);
      setAverageRating(avgScore);



      // 🔐 Requisição privada (partidas)
      if (loggedIn) {
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };

        const matchesResponse = await apiClient.get(`/partidas/`, config);
        const matches = matchesResponse.data.filter((m: any) => m.jogo === id);

        const matchDates: Record<string, number> = {};
        matches.forEach((m: any) => {
          const date = new Date(m.inicio).toLocaleDateString('pt-BR');
          matchDates[date] = (matchDates[date] || 0) + 1;
        });

        setPlayCount(matches.length);
        setMatchesByDate(matchDates);
      }

    } catch (err) {
      logger.error('Erro ao buscar dados:', err);
      setError('Erro ao buscar dados da API.');
    } finally {
      setLoading(false);
    }
  };

  const hexToRgba = (hex: string, alpha: number) => {
    const match = hex.replace('#', '').match(/.{1,2}/g);
    if (!match) return hex;
    const [r, g, b] = match.map((x) => parseInt(x, 16));
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };


  useEffect(() => {
    if (id) fetchGameAndData();
  }, [id]);

  return (
    <HeaderLayout title="Desempenho">
      <ProfileLayout id={game?._id} name={game?.nome} photo={game?.foto} isUser={false}>
        {loading ? (
          <ActivityIndicator size="large" color={colors.backgroundHighlight} />
        ) : error ? (
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
            <ButtonHighlight title="Fazer Login" onPress={() => router.push('/login')} />
          </View>
        ) : !data.length || averageRating === null ? (
          <View style={styles.alertContainer}>
            <Text style={[globalStyles.textCenteredBold, { fontSize: 48, fontFamily, marginBottom: 12 }]}>
              📊
            </Text>
            <Text
              style={{
                textAlign: 'center',
                fontSize: 16,
                color: colors.textOnBase,
                fontFamily,
                marginBottom: 16,
              }}>
              Ainda não há avaliações registradas para este jogo.
            </Text>
          </View>
        ) : (
          <>
            {/* Avaliação geral (visível sempre) */}
          <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                flexWrap: 'wrap',
                gap: 16,
                marginBottom: 20,
              }}>
              <View
                style={{
                  backgroundColor: '#F5F5F5',
                  borderRadius: 12,
                  paddingVertical: 20,
                  paddingHorizontal: 24,
                  minWidth: 140,
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexGrow: 1,
                  maxWidth: 180,
                }}>
                <Text
                  style={{
                    fontSize: fontSizes.base,
                    fontFamily,
                    color: '#333',
                    marginBottom: 8,
                    fontWeight: '600',
                  }}>
                  Média Geral
                </Text>
                <Text
                  style={{
                    fontSize: fontSizes.giant,
                    fontFamily,
                    fontWeight: '700',
                    color: colors.backgroundHighlight,
                  }}>
                  {averageRating?.toFixed(1)}
                </Text>
              </View>

              {isLoggedIn && (
                <View
                  style={{
                    backgroundColor: '#F5F5F5',
                    borderRadius: 12,
                    paddingVertical: 20,
                    paddingHorizontal: 24,
                    minWidth: 140,
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexGrow: 1,
                    maxWidth: 180,
                  }}>
                  <Text
                    style={{
                      fontSize: fontSizes.base,
                      fontFamily,
                      color: '#333',
                      marginBottom: 8,
                      fontWeight: '600',
                    }}>
                    Vezes Jogadas
                  </Text>
                  <Text
                    style={{
                      fontSize: fontSizes.giant,
                      fontFamily,
                      fontWeight: '700',
                      color: colors.backgroundHighlight,
                    }}>
                    {playCount}
                  </Text>
                </View>
              )}
            </View>


            {/* Gráfico de categorias */}
            <Text
              style={[
                globalStyles.textCenteredBold,
                { color: colors.textOnBase, fontFamily, fontSize: fontSizes.large },
              ]}>
              Avaliação por Categoria
            </Text>
            <View style={styles.chartContainer}>
              <Svg width={svgSize} height={svgSize}>
                {[1, 0.75, 0.5, 0.25].map((f, i) => (
                  <Polygon
                    key={i}
                    points={categories
                      .map((_, idx) => {
                        const { x, y } = calculateCoordinates(f * maxValue, idx, categories.length);
                        return `${x},${y}`;
                      })
                      .join(' ')}
                    stroke="gray"
                    strokeWidth="0.5"
                    fill="none"
                  />
                ))}
                {categories.map((_, idx) => {
                  const { x, y } = calculateCoordinates(maxValue, idx, categories.length);
                  return (
                    <Line
                      key={idx}
                      x1={margin + radius}
                      y1={margin + radius}
                      x2={x}
                      y2={y}
                      stroke="gray"
                      strokeWidth="0.5"
                    />
                  );
                })}
                <Polygon points={points} fill={hexToRgba(colors.backgroundHighlight, 0.2)} stroke={hexToRgba(colors.backgroundHighlight, 0.8)} />
                <Circle cx={margin + radius} cy={margin + radius} r="3" fill="black" />
                {categories.map((cat, idx) => {
                  const { x, y } = calculateCoordinates(maxValue + 20, idx, categories.length);
                  return (
                    <SvgText
                      key={idx}
                      x={x}
                      y={y}
                      fontSize="1"
                      textAnchor="middle"
                      fill={colors.textOnBase}>
                      {cat}
                    </SvgText>
                  );
                })}
              </Svg>
            </View>

            {/* Partidas por Dia – somente se logado */}
            {isLoggedIn ? (
              <>
                <Text
                  style={[
                    globalStyles.textCenteredBold,
                    {
                      color: colors.textOnBase,
                      fontFamily,
                      fontSize: fontSizes.large,
                      marginTop: 24,
                      marginBottom: 12,
                    },
                  ]}>
                  Partidas por Dia
                </Text>

                <View style={styles.matchList}>
                  {Object.entries(matchesByDate).map(([date, count], i) => (
                    <View key={i} style={styles.matchItem}>
                      <Text style={styles.matchDate}>{date}</Text>
                      <Text style={styles.matchCount}>{count} partida(s)</Text>
                    </View>
                  ))}
                </View>
              </>
            ) : (
              <View style={{ marginTop: 20, alignItems: 'center' }}>
                <Text
                  style={{
                    textAlign: 'center',
                    fontSize: 14,
                    color: colors.textOnBase,
                    fontFamily,
                    marginBottom: 8,
                  }}>
                  Para visualizar o histórico de partidas e estatísticas completas, faça login.
                </Text>
                <ButtonHighlight title="Fazer Login" onPress={() => router.push('/login')} />
              </View>
            )}
          </>
        )}
      </ProfileLayout>
    </HeaderLayout>
  );
}

const styles = StyleSheet.create({
  alertContainer: {
    borderRadius: 12,
    padding: 16,
    margin: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  chartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 20,
  },
  matchList: {
    flexDirection: 'column',
    gap: 8,
    paddingHorizontal: 16,
    marginBottom: 24,
    alignSelf: 'center',
    width: '100%',
    maxWidth: 400,
  },
  matchItem: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  matchDate: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  matchCount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF7043',
  },
});

