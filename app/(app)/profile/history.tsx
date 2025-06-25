// app/(app)/profile/history.tsx
import { ButtonHighlight, HeaderLayout, ProfileLayout } from '@components/index';
import { logger } from '@lib/logger';
import { apiClient } from '@services/apiClient';
import { storage } from '@store/storage';
import { globalStyles, useTheme } from '@theme/index';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';

interface Usuario {
  apelido: string;
  _id: string;
}

interface Vencedor {
  apelido: string;
  _id: string;
}

interface Partida {
  _id: string;
  usuarios: Usuario[];
  jogo: string;
  explicacao: string;
  inicio: string;
  fim: string | null;
  registrador: string;
  vencedor: Vencedor[];
  duracao: number;
  nomeJogo?: string;
}

export default function History() {
  const [user, setUser] = useState<any>(null);
  const [partidas, setPartidas] = useState<Partida[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { colors, fontSizes, fontFamily } = useTheme();

  useEffect(() => {
    async function fetchPartidas() {
      try {
        const userId = await storage.getItem('userId');
        const token = await storage.getItem('token');
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };

        // Obtém o apelido do usuário logado

        const usuarioResponse = await apiClient.get<Usuario>(`/usuarios/${userId}`, config);
        const usuarioApelido = usuarioResponse.data.apelido;
        setUser(usuarioResponse.data);

        // Busca todas as partidas
        const partidasResponse = await apiClient.get<Partida[]>('/partidas/', config);
        const partidasData = partidasResponse.data;

        // Filtra partidas nas quais o usuário participou
        const partidasFiltradas = partidasResponse.data.filter((partida) =>
          partida.usuarios.some((usuario) => usuario.apelido === usuarioApelido)
        );

        // Adiciona títulos aos jogos
        const partidasComNomes: Partida[] = await Promise.all(
          partidasFiltradas.map(async (partida) => {
            const jogoResponse = await apiClient.get<{ nome: string }>(`/jogos/${partida.jogo}`);
            return {
              ...partida,
              nomeJogo: jogoResponse.data.nome || 'Título não disponível',
            };
          })
        );

        setPartidas(partidasComNomes);
      } catch (error) {
        logger.error('Erro ao buscar partidas:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchPartidas();
  }, []);

  const formatarData = (data: string | null): string => {
    if (!data) return 'Partida não concluída';
    const dataObj = new Date(data);
    return dataObj.toLocaleDateString('pt-BR');
  };

  return (
    <HeaderLayout title="Perfil" scrollable={false}>
      <ProfileLayout
        id={user?._id}
        name={user?.nome}
        photo={user?.foto}
        cover={user?.capa}
        isEditing={false}
        isUser={true}
        isLoading={loading}>
        <ScrollView
          contentContainerStyle={{ paddingVertical: 16 }}
          showsVerticalScrollIndicator={false}>
          {partidas.length === 0 ? (
            <View style={{ alignItems: 'center', paddingVertical: 32 }}>
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

              <ButtonHighlight title={'Ir para Partidas'} onPress={() => router.push("/(app)/matches/matchStart")}></ButtonHighlight>
            </View>
          ) : (

            partidas.map((partida) => {
              const dataConclusao = formatarData(partida.fim);
              const participantes = partida.usuarios.map((u) => u.apelido).join(', ');
              const vencedorNome = partida.vencedor.map((v) => v.apelido).join(', ');

              return (
                <View
                  key={partida._id}
                  accessible
                  accessibilityLabel={`Partida de ${partida.nomeJogo}`}
                  accessibilityHint={`Realizada em ${dataConclusao}, participantes: ${participantes}, duração: ${partida.duracao * 60} minutos, explicação: ${partida.explicacao} minutos, vencedor: ${vencedorNome || 'nenhum'}`}
                  style={{
                    backgroundColor: colors.backgroundSemiHighlight,
                    marginVertical: 6,
                    borderRadius: 8,
                    padding: 12,
                  }}>
                  <Text style={{ color: colors.textOnSemiHighlight, fontWeight: 'bold' }}>
                    {partida.nomeJogo}
                  </Text>
                  <Text style={{ color: colors.textOnBase}}>Data: {dataConclusao}</Text>
                  <Text style={{ color: colors.textOnBase }}>
                    Participantes: {participantes}
                  </Text>
                  <Text style={{ color: colors.textOnBase }}>
                    Duração: {partida.duracao * 60} minutos
                  </Text>
                  <Text style={{ color: colors.textOnBase }}>
                    Explicação: {partida.explicacao} minutos
                  </Text>
                  <Text style={{ color: colors.textOnBase }}>
                    Vencedor: {vencedorNome || 'Nenhum'}
                  </Text>
                </View>
              );
            })
          )}
        </ScrollView>
      </ProfileLayout>
    </HeaderLayout>
  );
}
