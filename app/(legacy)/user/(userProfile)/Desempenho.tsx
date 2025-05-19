import { logger } from '@lib/logger';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient } from '@services/apiClient';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { Circle, G, Line, Polygon, Svg, Text as SvgText } from 'react-native-svg';
import Toast from 'react-native-toast-message';

export default function Desempenho() {
  // Estados
  const [apelido, setApelido] = useState<string | null>(null);
  const [vitorias, setVitorias] = useState<number>(0);
  const [derrotas, setDerrotas] = useState<number>(0);
  const [categorias, setCategorias] = useState<{ [key: string]: number }>({}); // Vitórias por categoria
  const [isLoading, setIsLoading] = useState<boolean>(true); // Novo estado

  // Função para buscar o apelido do usuário
  const buscarApelido = async () => {
    try {
      setIsLoading(true); // Inicia carregamento
      const userId = await AsyncStorage.getItem('userId');
      const token = await AsyncStorage.getItem('token');

      if (!userId || !token) {
        Toast.show({
          type: 'error',
          text1: 'Erro',
          text2: 'Usuário não autenticado.',
        });
        return;
      }

      const response = await apiClient.get(`/usuarios/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setApelido(response.data.apelido);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        logger.error('Erro na API:', error.response?.data || error.message);
        Toast.show({
          type: 'error',
          text1: 'Erro',
          text2: 'Usuário não autenticado.',
        });
      } else {
        logger.error('Erro desconhecido:', error);
        Toast.show({
          type: 'error',
          text1: 'Erro',
          text2: 'Ocorreu um erro inesperado.',
        });
      }
    } finally {
      setIsLoading(false); // Finaliza carregamento
    }
  };

  // Função para buscar as partidas e calcular vitórias e derrotas
  const buscarPartidas = async (apelido: string) => {
    try {
      setIsLoading(true); // Inicia carregamento
      const token = await AsyncStorage.getItem('token');

      if (!token) {
        Toast.show({
          type: 'error',
          text1: 'Erro',
          text2: 'Token de autenticação não encontrado.',
        });
        return;
      }

      const response = await apiClient.get('/partidas/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const partidas = response.data;

      const categoriasTemp: { [key: string]: number } = {};
      const vitoriasTemp = partidas.filter((partida: any) =>
        partida.vencedor.some((v: any) => v.apelido === apelido)
      );

      // Buscar categorias
      for (const partida of vitoriasTemp) {
        const jogoId = partida.jogo; // ID do jogo
        try {
          const jogoResponse = await apiClient.get(`/jogos/${jogoId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const categoria = jogoResponse.data.categoria;
          categoriasTemp[categoria] = (categoriasTemp[categoria] || 0) + 1;
        } catch (error) {
          logger.error(`Erro ao buscar categoria do jogo ${jogoId}:`, error);
        }
      }

      setCategorias({ ...categoriasTemp });

      // Contar derrotas
      const derrotas =
        partidas.filter((partida: any) => partida.usuarios.some((u: any) => u.apelido === apelido))
          .length - vitoriasTemp.length;

      setVitorias(vitoriasTemp.length);
      setDerrotas(derrotas);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        logger.error('Erro na API:', error.response?.data || error.message);
        Toast.show({
          type: 'error',
          text1: 'Erro',
          text2: 'Não foi possível buscar as partidas.',
        });
      } else {
        logger.error('Erro desconhecido:', error);
        Toast.show({
          type: 'error',
          text1: 'Erro',
          text2: 'Ocorreu um erro inesperado.',
        });
      }
    } finally {
      setIsLoading(false); // Finaliza carregamento
    }
  };

  useEffect(() => {
    buscarApelido();
  }, []);

  useEffect(() => {
    if (apelido) {
      buscarPartidas(apelido);
    }
  }, [apelido]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#FF8C00" />
        <Text style={{ marginTop: 10 }}>Carregando informações...</Text>
      </View>
    );
  }

  // Dados do gráfico de indicador
  const total = vitorias + derrotas;
  const vitoriasPercent = total > 0 ? (vitorias / total) * 100 : 0;
  const derrotasPercent = total > 0 ? (derrotas / total) * 100 : 0;

  const radius = 100;
  const strokeWidth = 20;
  const circumference = Math.PI * radius;
  const offsetDerrotas = (1 - derrotasPercent / 100) * circumference;

  // Configuração do gráfico de teia de aranha
  const labels = Object.keys(categorias);
  const values = Object.values(categorias);
  const max = Math.max(...Object.values(categorias), 1); // Define o máximo dinamicamente
  const centerX = 125;
  const centerY = 125;
  const chartRadius = 90;

  const calculatePoints = (values: number[], radius: number) => {
    const max = Math.max(...values); // Máximo para normalizar os valores
    return values.map((value, index) => {
      const angle = (2 * Math.PI * index) / values.length - Math.PI / 2;
      const scaledValue = (value / max) * radius; // Proporção ao raio
      return {
        x: centerX + scaledValue * Math.cos(angle),
        y: centerY + scaledValue * Math.sin(angle),
      };
    });
  };

  const outerPoints = calculatePoints(Array(labels.length).fill(max), chartRadius);
  const valuePoints = calculatePoints(
    values.map((v) => (v / max) * chartRadius),
    chartRadius
  );

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} style={{ flex: 1 }}>
      <View style={{ alignItems: 'center', paddingVertical: 20 }}>
        <Text style={{ fontSize: 18, marginBottom: 10 }}>Desempenho</Text>

        {/* Gráfico de Indicador */}
        <Svg height={150} width={250} viewBox="0 0 250 150">
          <G rotation="-90" origin="125, 125">
            {/* Círculo completo (background) */}
            <Circle
              cx="125"
              cy="125"
              r={radius}
              stroke="#ddd"
              strokeWidth={strokeWidth}
              fill="none"
              strokeDasharray={`${circumference} ${circumference}`}
              strokeDashoffset={0}
            />
            {/* Círculo de derrotas (vermelho) */}
            <Circle
              cx="125"
              cy="125"
              r={radius}
              stroke="#808080"
              strokeWidth={strokeWidth}
              fill="none"
              strokeDasharray={`${circumference} ${circumference}`}
              strokeDashoffset={offsetDerrotas}
            />
            {/* Círculo de vitórias (verde) */}
            <Circle
              cx="125"
              cy="125"
              r={radius}
              stroke="#fc8e49"
              strokeWidth={strokeWidth}
              fill="none"
              strokeDasharray={`${circumference} ${circumference}`}
              strokeDashoffset={circumference - offsetDerrotas}
            />
          </G>
          <SvgText x="125" y="120" textAnchor="middle" fontSize="20" fill="#333" dy="8">
            {`${vitoriasPercent.toFixed(1)}%`}
          </SvgText>
        </Svg>

        <Text style={{ fontSize: 16, marginTop: 10 }}>
          Vitórias: {vitorias} | Derrotas: {derrotas}
        </Text>

        <Text style={{ fontSize: 18, marginVertical: 30, marginBottom: 0 }}>
          Desempenho por categoria
        </Text>

        {/* Gráfico de Teia de Aranha */}
        <Svg height={350} width={350} viewBox="-30 -30 310 310">
          {outerPoints.map((point, index) => (
            <Line
              key={`line-${index}`}
              x1={centerX}
              y1={centerY}
              x2={point.x}
              y2={point.y}
              stroke="#ccc"
              strokeWidth={1}
            />
          ))}
          {Array.from({ length: 5 }, (_, i) => {
            const innerRadius = (chartRadius / 5) * (i + 1);
            const innerPoints = calculatePoints(Array(labels.length).fill(max), innerRadius);
            return (
              <Polygon
                key={`polygon-${i}`}
                points={innerPoints.map((p) => `${p.x},${p.y}`).join(' ')}
                stroke="#ccc"
                strokeWidth={1}
                fill="none"
              />
            );
          })}
          <Polygon
            points={valuePoints.map((p) => `${p.x},${p.y}`).join(' ')}
            stroke="#FFA07A"
            strokeWidth={2}
            fill="rgba(255, 160, 122, 0.4)"
          />
          {outerPoints.map((point, index) => (
            <SvgText
              key={`label-${index}`}
              x={point.x}
              y={point.y}
              textAnchor={point.x > centerX ? 'start' : point.x < centerX ? 'end' : 'middle'}
              fontSize="10"
              fill="#333"
              dx={point.x > centerX ? 15 : point.x < centerX ? -15 : 0} // Desloca mais
              dy={point.y > centerY ? 10 : point.y < centerY ? -10 : -5} // Ajusta no eixo vertical
            >
              {`${labels[index]}: ${values[index]}`}
            </SvgText>
          ))}
        </Svg>
      </View>
    </ScrollView>
  );
}
