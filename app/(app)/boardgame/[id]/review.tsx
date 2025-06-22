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
      setIsLoggedIn(!!token);

      const gameResponse = await apiClient.get(`/jogos/${id}`);
      setGame(gameResponse.data);

      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      const [evaluationsResponse, matchesResponse] = await Promise.all([
        apiClient.get(`/avaliacoes/`, config),
        apiClient.get(`/partidas/`, config),
      ]);

      const evaluations = evaluationsResponse.data.filter((e: any) => e.jogo === id);
      const matches = matchesResponse.data.filter((m: any) => m.jogo === id);

      if (evaluations.length === 0) {
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
        return sum / evaluations.length;
      });

      const avgScore =
        evaluations.reduce((acc: number, cur: any) => acc + (cur.nota || 0), 0) /
        evaluations.length;

      const matchDates: Record<string, number> = {};
      matches.forEach((m: any) => {
        const date = new Date(m.inicio).toLocaleDateString('pt-BR');
        matchDates[date] = (matchDates[date] || 0) + 1;
      });

      setData(averages);
      setAverageRating(avgScore);
      setPlayCount(matches.length);
      setMatchesByDate(matchDates);
    } catch (err) {
      logger.error('Erro ao buscar dados:', err);
      setError('Erro ao buscar dados da API.');
    } finally {
      setLoading(false);
    }
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
          <Text style={styles.error}>{error}</Text>
        ) : (
          <>
            <View style={styles.cardsContainer}>
              <View style={styles.card}>
                <Text>Média Geral</Text>
                <Text>{averageRating?.toFixed(1)}</Text>
              </View>
              <View style={styles.card}>
                <Text>Vezes Jogadas</Text>
                <Text>{playCount}</Text>
              </View>
            </View>

            <Text
              style={[
                globalStyles.textCenteredBold,
                { color: colors.textOnBase, fontFamily, fontSize: fontSizes.large },
              ]}>
              Avaliação por Categoria
            </Text>
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
              <Polygon points={points} fill="rgba(255, 160, 122, 0.3)" stroke="orange" />
              <Circle cx={margin + radius} cy={margin + radius} r="3" fill="black" />
              {categories.map((cat, idx) => {
                const { x, y } = calculateCoordinates(maxValue + 20, idx, categories.length);
                return (
                  <SvgText
                    key={idx}
                    x={x}
                    y={y}
                    fontSize="12"
                    textAnchor="middle"
                    fill={colors.textOnBase}>
                    {cat}
                  </SvgText>
                );
              })}
            </Svg>

            <Text
              style={[
                globalStyles.textCenteredBold,
                { color: colors.textOnBase, fontFamily, fontSize: fontSizes.large },
              ]}>
              Partidas por Dia
            </Text>
            {Object.entries(matchesByDate).map(([date, count], i) => (
              <Text key={i}>
                {date}: {count} partida(s)
              </Text>
            ))}
          </>
        )}
      </ProfileLayout>
    </HeaderLayout>
  );
}

const styles = StyleSheet.create({
  error: { color: 'red', textAlign: 'center', marginVertical: 12 },
  cardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  card: {
    padding: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    alignItems: 'center',
    minWidth: 100,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
  },
  alertContainer: {
    //: '#FFF4E5',
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
  }
});
