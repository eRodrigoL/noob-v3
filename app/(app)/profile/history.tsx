// app/(app)/profile/history.tsx
import { HeaderLayout, ProfileLayout } from '@components/index';
import { logger } from '@lib/logger';
import { apiClient } from '@services/apiClient';
import { storage } from '@store/storage';
import { useTheme } from '@theme/index';
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
  tituloJogo?: string;
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
        const partidasComTitulos: Partida[] = await Promise.all(
          partidasFiltradas.map(async (partida) => {
            const jogoResponse = await apiClient.get<{ titulo: string }>(`/jogos/${partida.jogo}`);
            return {
              ...partida,
              tituloJogo: jogoResponse.data.titulo || 'Título não disponível',
            };
          })
        );

        setPartidas(partidasComTitulos);
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
        initialIsRegisting={false}
        isEditing={false}
        isUser={true}
        isLoading={loading}>
        <ScrollView
          contentContainerStyle={{ paddingVertical: 16 }}
          showsVerticalScrollIndicator={false}>
          {partidas.length === 0 ? (
            <Text
              style={{
                color: colors.textOnBase,
                fontFamily,
                fontSize: fontSizes.base,
                textAlign: 'center',
              }}>
              Nenhuma partida encontrada.
            </Text>
          ) : (
            partidas.map((partida) => {
              const dataConclusao = formatarData(partida.fim);
              const participantes = partida.usuarios.map((u) => u.apelido).join(', ');
              const vencedorNome = partida.vencedor.map((v) => v.apelido).join(', ');

              return (
                <View
                  key={partida._id}
                  style={{
                    backgroundColor: colors.backgroundSemiHighlight,
                    marginVertical: 6,
                    borderRadius: 8,
                    padding: 12,
                  }}>
                  <Text style={{ color: colors.textOnHighlight, fontWeight: 'bold' }}>
                    {partida.tituloJogo}
                  </Text>
                  <Text style={{ color: colors.textOnHighlight }}>Data: {dataConclusao}</Text>
                  <Text style={{ color: colors.textOnHighlight }}>
                    Participantes: {participantes}
                  </Text>
                  <Text style={{ color: colors.textOnHighlight }}>
                    Duração: {partida.duracao * 60} minutos
                  </Text>
                  <Text style={{ color: colors.textOnHighlight }}>
                    Explicação: {partida.explicacao} minutos
                  </Text>
                  <Text style={{ color: colors.textOnHighlight }}>
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
