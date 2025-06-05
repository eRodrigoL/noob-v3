import { logger } from '@lib/logger';
import { apiClient } from '@services/apiClient';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, Text, View } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { storage } from '@store/storage';

// Tipo para a estrutura de um vencedor
type Vencedor = {
  apelido: string;
  _id: string;
};

// Tipo para uma partida
type Partida = {
  _id: string;
  usuarios: { apelido: string; _id: string }[];
  vencedor: Vencedor[];
  [key: string]: any; // Para ignorar outras propriedades não usadas
};

// Tipo para os dados do ranking
type RankingItem = {
  apelido: string;
  count: number;
};

export default function Ranking() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const [loading, setLoading] = useState(true);
  const [rankingData, setRankingData] = useState<RankingItem[]>([]);

  const screenWidth = Dimensions.get('window').width;

  useEffect(() => {
    const fetchPartidas = async () => {
      try {
        const token = await storage.getItem('token');
        const userId = await storage.getItem('userId');

        if (!token || !userId) {
          //console.error("Realize o login para consultar o ranking!");
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

        const response = await apiClient.get<Partida[]>('/partidas', config);

        // Garantir que a resposta seja um array
        const partidas = Array.isArray(response.data) ? response.data : [];

        // **Filtrar partidas pelo ID do jogo, se o `id` estiver definido**
        const partidasFiltradas = id ? partidas.filter((partida) => partida.jogo === id) : partidas;

        // Se nenhuma partida for encontrada, limpar o ranking
        if (partidasFiltradas.length === 0) {
          setRankingData([]);
          setLoading(false);
          return;
        }

        // Filtrar vencedores e calcular vitórias
        const vencedores = partidasFiltradas
          .filter((partida) => partida.vencedor.some((v) => v.apelido.startsWith('@')))
          .flatMap((partida) => partida.vencedor.filter((v) => v.apelido.startsWith('@')));

        const vitoriaContagem: Record<string, number> = vencedores.reduce(
          (acc: Record<string, number>, vencedor) => {
            acc[vencedor.apelido] = (acc[vencedor.apelido] || 0) + 1;
            return acc;
          },
          {}
        );

        // Transformar em array, ordenar e pegar os 5 primeiros
        const ranking = Object.entries(vitoriaContagem)
          .map(([apelido, count]) => ({ apelido, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);

        setRankingData(ranking);

        // **Log para verificar o ranking gerado**
        // console.log("Ranking gerado:", ranking);
      } catch (error) {
        logger.error('Erro ao buscar partidas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPartidas();
  }, [id]); // Dependência no `id` para refazer a busca se ele mudar

  const data = {
    labels: rankingData.map((item) => item.apelido),
    datasets: [
      {
        data: rankingData.map((item) => item.count),
      },
    ],
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f9f9f9',
      }}>
      <Text style={{ marginBottom: 20, fontSize: 18, fontWeight: 'bold' }}>
        Ranking geral do jogo{' '}
      </Text>

      {loading ? (
        <ActivityIndicator size="large" color="#FF8C00" />
      ) : rankingData.length > 0 ? (
        <BarChart
          data={data}
          width={screenWidth - 40}
          height={300}
          yAxisLabel=""
          yAxisSuffix=""
          showValuesOnTopOfBars={true}
          fromZero={true}
          chartConfig={{
            backgroundColor: '#FFFFFF',
            backgroundGradientFrom: '#FFFFFF',
            backgroundGradientTo: '#FFFFFF',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(255, 130, 90, 1)`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, 1)`,
            style: {
              borderRadius: 16,
            },
            propsForBackgroundLines: {
              strokeWidth: 0.5,
              stroke: '#e3e3e3',
            },
          }}
          style={{
            marginVertical: 10,
            borderRadius: 16,
          }}
        />
      ) : (
        <Text style={{ fontSize: 16, color: 'red' }}>Nenhum dado disponível para exibir.</Text>
      )}
    </View>
  );
}

function setError(arg0: string) {
  throw new Error('Function not implemented.');
}
