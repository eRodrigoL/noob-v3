import { logger } from '@lib/logger';
import { apiClient } from '@services/apiClient';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { Circle, Line, Polygon, Svg, Text as SvgText } from 'react-native-svg';
import { storage } from '@store/storage';

export default function GameDashboard() {
  const { id } = useLocalSearchParams<{ id?: string }>();

  const [data, setData] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [averageRating, setAverageRating] = useState<number | null>(null);
  const [playCount, setPlayCount] = useState<number | null>(null);

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

  const fetchData = async () => {
    try {
      // Recuperar token e userId do AsyncStorage
      const token = await storage.getItem('token');
      const userId = await storage.getItem('userId');

      if (!token || !userId) {
        setError('Erro de autenticação: Token ou userId ausente.');
        setLoading(false);
        return;
      }

      // Configurar cabeçalhos com o token
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      };

      // Requisições simultâneas às APIs com o token
      const [evaluationsResponse, matchesResponse] = await Promise.all([
        apiClient.get(`/avaliacoes/`, config),
        apiClient.get(`/partidas/`, config),
      ]);

      // Filtrar os dados necessários
      const evaluations = evaluationsResponse.data.filter(
        (evaluation: any) => evaluation.jogo === id
      );

      const matches = matchesResponse.data.filter((match: any) => match.jogo === id);

      if (evaluations.length === 0) {
        setError('Nenhuma avaliação encontrada para este jogo.');
        setLoading(false);
        return;
      }

      const categoryMapping: { [key: string]: string } = {
        Beleza: 'beleza',
        Divertimento: 'divertimento',
        Duração: 'duracao',
        Preço: 'preco',
        Armazenamento: 'armazenamento',
      };

      // Calcular as médias das categorias
      const averages = categories.map((category) => {
        const apiField = categoryMapping[category];
        const sum = evaluations.reduce((acc: number, curr: any) => acc + (curr[apiField] || 0), 0);
        return sum / evaluations.length;
      });

      // Calcular a média geral
      const totalAverage =
        evaluations.reduce((acc: number, curr: any) => acc + curr.nota, 0) / evaluations.length;

      setData(averages);
      setAverageRating(totalAverage);
      setPlayCount(matches.length);
      setLoading(false);
    } catch (err) {
      logger.error('Erro ao buscar dados:', err);
      setError('Erro ao buscar dados da API.');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}> Avaliação do jogo </Text>

      {loading ? (
        <ActivityIndicator size="large" color="#FF8C00" />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <>
          {/* Cards com informações */}
          <View style={styles.cardsContainer}>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Média Geral</Text>
              <Text style={styles.cardValue}>
                {averageRating !== null ? averageRating.toFixed(1) : 'N/A'}
              </Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Vezes Jogadas</Text>
              <Text style={styles.cardValue}>{playCount !== null ? playCount : 'N/A'}</Text>
            </View>
          </View>

          <Svg width={svgSize} height={svgSize}>
            {/* Linhas da grade */}
            {[1, 0.75, 0.5, 0.25].map((factor, i) => (
              <Polygon
                key={i}
                points={categories
                  .map((_, index) => {
                    const { x, y } = calculateCoordinates(
                      factor * maxValue,
                      index,
                      categories.length
                    );
                    return `${x},${y}`;
                  })
                  .join(' ')}
                stroke="gray"
                strokeWidth="0.5"
                fill="none"
              />
            ))}

            {/* Eixos */}
            {categories.map((_, index) => {
              const { x, y } = calculateCoordinates(maxValue, index, categories.length);
              return (
                <Line
                  key={index}
                  x1={margin + radius}
                  y1={margin + radius}
                  x2={x}
                  y2={y}
                  stroke="gray"
                  strokeWidth="0.5"
                />
              );
            })}

            {/* Polígono dos dados */}
            <Polygon points={points} fill="rgba(255, 160, 122, 0.3)" stroke="orange" />

            {/* Categorias e rótulos de valores */}
            {categories.map((category, index) => {
              // Calcular posição do rótulo da categoria
              const { x: categoryX, y: categoryY } = calculateCoordinates(
                maxValue + 20,
                index,
                categories.length
              );

              // Calcular posição do rótulo do valor
              const { x: valueX, y: valueY } = calculateCoordinates(
                data[index],
                index,
                categories.length
              );

              return (
                <React.Fragment key={index}>
                  {/* Rótulo da categoria */}
                  <SvgText
                    x={categoryX}
                    y={categoryY}
                    fontSize="12"
                    textAnchor="middle"
                    fill="black">
                    {category}
                  </SvgText>

                  {/* Rótulo do valor (perto da linha correspondente) */}
                  {/* Rótulo do valor */}
                  <SvgText
                    x={categoryX} // Mesmo x do rótulo da categoria
                    y={categoryY + 14} // Abaixo do rótulo da categoria
                    fontSize="10"
                    textAnchor="middle"
                    fill="black">
                    {data[index].toFixed(1)}
                  </SvgText>
                </React.Fragment>
              );
            })}

            {/* Centro */}
            <Circle cx={margin + radius} cy={margin + radius} r="3" fill="black" />
          </Svg>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    marginBottom: 20,
    fontSize: 18,
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    fontSize: 16,
  },
  cardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    width: '100%',
  },
  card: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 16,
    marginHorizontal: 8,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 14,
    color: '#555',
  },
  cardValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 8,
  },
});
