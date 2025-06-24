// app/(app)/profile/performance.tsx
import { ButtonHighlight, HeaderLayout, ProfileLayout } from '@components/index';
import { logger } from '@lib/logger';
import { apiClient } from '@services/apiClient';
import { storage } from '@store/storage';
import { globalStyles, useTheme } from '@theme/index';
import axios from 'axios';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Circle, G, Line, Polygon, Svg, Text as SvgText } from 'react-native-svg';
import Toast from 'react-native-toast-message';

export default function Desempenho() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, seteditedData] = useState<any>(null);
  const { colors, fontSizes, fontFamily } = useTheme();
  // Estados
  const [apelido, setApelido] = useState<string | null>(null);
  const [vitorias, setVitorias] = useState<number>(0);
  const [derrotas, setDerrotas] = useState<number>(0);
  const [categorias, setCategorias] = useState<{ [key: string]: number }>({});


  // Função para buscar o apelido do usuário
  const fetchUserData = async () => {
    try {
      setLoading(true);
      const userId = await storage.getItem('userId');
      const token = await storage.getItem('token');

      if (!userId || !token) {
        Toast.show({ type: 'error', text1: 'Erro', text2: 'Usuário não autenticado.' });
        return;
      }

      const response = await apiClient.get(`/usuarios/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser(response.data);
      seteditedData(response.data);
      setApelido(response.data.apelido);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        logger.error('Erro na API:', error.response?.data || error.message);
      } else {
        logger.error('Erro desconhecido:', error);
      }
      Toast.show({ type: 'error', text1: 'Erro', text2: 'Falha ao buscar usuário.' });
    } finally {
      setLoading(false); // Finaliza carregamento
    }
  };

  // Função para buscar as partidas e calcular vitórias e derrotas
  const buscarPartidas = async (apelido: string) => {
    try {
      setLoading(true); // Inicia carregamento
      const token = await storage.getItem('token');

      if (!token) {
        Toast.show({
          type: 'error',
          text1: 'Erro',
          text2: 'Token de autenticação não encontrado.',
        });
        return;
      }

      const response = await apiClient.get('/partidas/', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const partidas = response.data;

      const categoriasTemp: { [key: string]: number } = {};
      const vitoriasTemp = partidas.filter((p: any) =>
        p.vencedor.some((v: any) => v.apelido === apelido)
      );

      // Buscar categorias
      for (const partida of vitoriasTemp) {
        const jogoId = partida.jogo;
        try {
          const jogoResp = await apiClient.get(`/jogos/${jogoId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const categoria = jogoResp.data.categoria;
          categoriasTemp[categoria] = (categoriasTemp[categoria] || 0) + 1;
        } catch (error) {
          logger.error(`Erro ao buscar categoria do jogo ${jogoId}:`, error);
        }
      }

      // Contar derrotas
      const derrotas =
        partidas.filter((p: any) => p.usuarios.some((u: any) => u.apelido === apelido)).length -
        vitoriasTemp.length;
      setCategorias({ ...categoriasTemp });

      setVitorias(vitoriasTemp.length);
      setDerrotas(derrotas);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        logger.error('Erro na API:', error.response?.data || error.message);
      } else {
        logger.error('Erro desconhecido:', error);
      }
      Toast.show({ type: 'error', text1: 'Erro', text2: 'Falha ao buscar partidas.' });
    } finally {
      setLoading(false); // Finaliza carregamento
    }
  };

  useEffect(() => {
    fetchUserData().finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (apelido) buscarPartidas(apelido);
  }, [apelido]);

  // Dados do gráfico de indicador
  const total = vitorias + derrotas;
  const vitoriasPercent = total > 0 ? (vitorias / total) * 100 : 0;
  const derrotasPercent = total > 0 ? (derrotas / total) * 100 : 0;

  const noData = vitorias === 0 && derrotas === 0 && Object.keys(categorias).length === 0;

  const radius = 100;
  const strokeWidth = 20;
  const circumference = Math.PI * radius;
  const offsetDerrotas = (1 - derrotasPercent / 100) * circumference;

  // Configuração do gráfico de teia de aranha
  const labels = Object.keys(categorias);
  const values = Object.values(categorias);
  const max = Math.max(...Object.values(categorias), 1);
  const centerX = 125;
  const centerY = 125;
  const chartRadius = 90;

  const calculatePoints = (values: number[], radius: number) => {
    const max = Math.max(...values);
    return values.map((value, i) => {
      const angle = (2 * Math.PI * i) / values.length - Math.PI / 2;
      const scaled = (value / max) * radius;
      return { x: centerX + scaled * Math.cos(angle), y: centerY + scaled * Math.sin(angle) };
    });
  };

  const outerPoints = calculatePoints(Array(labels.length).fill(max), chartRadius);
  const valuePoints = calculatePoints(
    values.map((v) => (v / max) * chartRadius),
    chartRadius
  );

  return (
    <HeaderLayout title="Perfil">
      <ProfileLayout
        id={user?._id}
        name={user?.nome}
        photo={user?.foto}
        cover={user?.capa}
        isEditing={isEditing}
        isUser={true}
        isLoading={loading}
        setEdited={seteditedData}>
        <View style={{ alignItems: 'center', paddingVertical: 20 }}>
          {noData ? (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                padding: 24,
                borderRadius: 12,
                marginTop: 30,
              }}>
              <Text
                style={[
                  globalStyles.textCenteredBold,
                  {
                    fontSize: 48,
                    fontFamily,
                    marginBottom: 12,
                  },
                ]}>
                🎲
              </Text>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 16,
                  color: colors.textOnBase,
                  fontFamily,
                  marginBottom: 12,
                }}>
                Você ainda não possui partidas registradas. Comece agora para acompanhar seu desempenho!
              </Text>

              <ButtonHighlight title={'Ir para Partidas'} onPress={() => router.push("/login")}>
              </ButtonHighlight>
            </View>
          ) : (
            <>
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
                {outerPoints.map((p, i) => (
                  <Line
                    key={`line-${i}`}
                    x1={centerX}
                    y1={centerY}
                    x2={p.x}
                    y2={p.y}
                    stroke="#ccc"
                    strokeWidth={1}
                  />
                ))}
                {Array.from({ length: 5 }, (_, i) => {
                  const r = (chartRadius / 5) * (i + 1);
                  const points = calculatePoints(Array(labels.length).fill(max), r);
                  return (
                    <Polygon
                      key={`polygon-${i}`}
                      points={points.map((p) => `${p.x},${p.y}`).join(' ')}
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
                {outerPoints.map((p, i) => (
                  <SvgText
                    key={`label-${i}`}
                    x={p.x}
                    y={p.y}
                    textAnchor={p.x > centerX ? 'start' : p.x < centerX ? 'end' : 'middle'}
                    fontSize="10"
                    fill="#333"
                    dx={p.x > centerX ? 15 : p.x < centerX ? -15 : 0}
                    dy={p.y > centerY ? 10 : p.y < centerY ? -10 : -5}>
                    {`${labels[i]}: ${values[i]}`}
                  </SvgText>
                ))}
              </Svg>
            </>
          )}
        </View>
      </ProfileLayout>
    </HeaderLayout>
  );
}
