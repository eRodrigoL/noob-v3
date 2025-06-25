// app/(app)/boardgame/[id]/review.tsx

// Importações de componentes, serviços, hooks e dependências para o layout, tema e funcionalidade da página.
import { ButtonHighlight, HeaderLayout, ProfileLayout } from '@components/index';
import { useGameId } from '@hooks/useGameId';
import { logger } from '@lib/logger';
import { apiClient } from '@services/apiClient';
import { storage } from '@store/storage';
import { globalStyles, useTheme } from '@theme/index';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { Circle, Line, Polygon, Svg, Text as SvgText } from 'react-native-svg';


// Componente principal responsável por exibir e manipular os dados de desempenho do jogo.
export default function GameReview() {
  // Estados e configurações para gerenciar dados do jogo, avaliações, carregamento e erros.
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

  // Configurações para o gráfico (categorias, dimensões, cálculo de coordenadas).
  const categories = ['Beleza', 'Divertimento', 'Duração', 'Preço', 'Armazenamento'];
  const maxValue = 100;
  const chartSize = 250;
  const margin = 70;
  const svgSize = chartSize + margin * 2;
  const radius = chartSize / 2;

  // Função para calcular as coordenadas de cada ponto no gráfico.
  const calculateCoordinates = (value: number, index: number, total: number) => {
    const angle = (Math.PI * 2 * index) / total;
    const distance = (value / maxValue) * radius;
    const x = margin + radius + distance * Math.sin(angle);
    const y = margin + radius - distance * Math.cos(angle);
    return { x, y };
  };

  // Gera os pontos para o polígono do gráfico.
  const points = data
    .map((value, index) => {
      const { x, y } = calculateCoordinates(value, index, data.length);
      return `${x},${y}`;
    })
    .join(' ');

    // Busca dados do jogo e estatísticas (avaliações e partidas) da API.
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

      // Calcula as médias para cada categoria e nota geral.
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

  // Requisição privada para partidas do jogo (se logado).
  const hexToRgba = (hex: string, alpha: number) => {
    const match = hex.replace('#', '').match(/.{1,2}/g);
    if (!match) return hex;
    const [r, g, b] = match.map((x) => parseInt(x, 16));
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

// Realiza a busca de dados ao carregar a página.
  useEffect(() => {
    if (id) fetchGameAndData();
  }, [id]);

  // Renderização do componente (gráfico, avaliações e partidas).
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
            <View style={styles.cardsContainer}>
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Média Geral</Text>
                <Text style={styles.cardValue}>{averageRating?.toFixed(1)}</Text>
              </View>

              {isLoggedIn && (
                <View style={styles.card}>
                  <Text style={styles.cardTitle}>Vezes Jogadas</Text>
                  <Text style={styles.cardValue}>{playCount}</Text>
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
                <Polygon points={points} fill={hexToRgba(colors.backgroundHighlight,0.2)} stroke={hexToRgba(colors.backgroundHighlight, 0.8)} />
                <Circle cx={margin + radius} cy={margin + radius} r="3" fill="black" />
                {categories.map((cat, idx) => {
                  const { x, y } = calculateCoordinates(maxValue + 20, idx, categories.length);
                  return (
                    <SvgText
                      key={idx}
                      x={x}
                      y={y}
                      fontSize="13"
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


// Estilos do componente / Configurações de layout e design.
const styles = StyleSheet.create({
  error: { color: 'red', textAlign: 'center', marginVertical: 12 },
  cardsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 20,
    flexWrap: 'wrap', // Para quebrar em telas pequenas
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 30,
    minWidth: 140,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    // largura responsiva opcional
    flexGrow: 1,
    maxWidth: 180,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
    marginBottom: 8,
  },

  cardValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FF7043', // cor destaque, pode ajustar para seu tema
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
  }
});
