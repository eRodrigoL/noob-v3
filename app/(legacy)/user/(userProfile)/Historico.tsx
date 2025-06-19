// app/(legacy)/user/(userProfile)/Historico.tsx
import { logger } from '@lib/logger';
import { apiClient } from '@services/apiClient';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { storage } from '@store/storage';

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

export default function Historico() {
  const [partidas, setPartidas] = useState<Partida[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchPartidas() {
      try {
        const userId = await storage.getItem('userId');
        const token = await storage.getItem('token');

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        };

        // Obtém o apelido do usuário logado

        const usuarioResponse = await apiClient.get<Usuario>(`/usuarios/${userId}`, config);
        const usuarioApelido = usuarioResponse.data.apelido;

        // Busca todas as partidas
        const partidasResponse = await apiClient.get<Partida[]>('/partidas/', config);
        const partidasData = partidasResponse.data;

        // Filtra partidas nas quais o usuário participou
        const partidasFiltradas = partidasData.filter((partida) =>
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
    const dia = String(dataObj.getDate()).padStart(2, '0');
    const mes = String(dataObj.getMonth() + 1).padStart(2, '0'); // Mês começa em 0
    const ano = dataObj.getFullYear();
    return `${dia}/${mes}/${ano}`;
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#FF8C00" />
        <Text>Carregando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Histórico de Partidas</Text>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {partidas.map((partida) => {
          const { nomeJogo, usuarios, vencedor, duracao, fim, explicacao } = partida;
          const dataConclusao = formatarData(fim);
          const participantes = usuarios.map((u) => u.apelido).join(', ');
          const vencedorNome = vencedor.map((v) => v.apelido).join(', ');

          return (
            <View key={partida._id} style={styles.item}>
              <Text style={styles.title}>Jogo: {nomeJogo}</Text>
              <Text>Data de conclusão: {dataConclusao}</Text>
              <Text>Participantes: {participantes}</Text>
              <Text>Duração: {duracao * 60 || 0} minutos</Text>
              <Text>Tempo de explicação: {explicacao} minutos</Text>
              <Text>Vencedor: {vencedorNome || 'Nenhum'}</Text>
            </View>
          );
        })}
        <Text style={styles.footer}>Fim do Histórico</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  scrollViewContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  item: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 8,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    padding: 10,
    textAlign: 'center',
    backgroundColor: '#e9e9e9',
  },
  footer: {
    fontSize: 14,
    textAlign: 'center',
    padding: 10,
    color: '#666',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
