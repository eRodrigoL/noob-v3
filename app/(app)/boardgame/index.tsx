// app/(app)/boardgame/index.tsx
import { CARD_GAP, CARD_WIDTH } from '@components/cards/GameCard/styles';
import {
  ButtonHighlight,
  GameCard,
  HeaderLayout,
  LoadingIndicator,
  NoResults,
  SearchBar,
} from '@components/index';
import { logger } from '@lib/logger';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient } from '@services/apiClient';
import { globalStyles, useTheme } from '@theme/index';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, Text, useWindowDimensions, View } from 'react-native';

interface Product {
  id: string;
  nome: string;
  ano?: number;
  foto?: string;
  score: string;
}

export default function List() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { width } = useWindowDimensions();
  const { colors, fontFamily, fontSizes } = useTheme();

  const numColumns = Math.max(1, Math.floor(width / (CARD_WIDTH + CARD_GAP)));
  const MAX_RETRY = 10;

  const fetchData = async () => {
    try {
      const [jogosResponse, avaliacoesResponse] = await Promise.all([
        apiClient.get('/jogos'),
        apiClient.get('/avaliacoes'),
      ]);

      const jogos = jogosResponse.data;
      const avaliacoes = avaliacoesResponse.data;

      const produtosComScore = jogos.map((jogo: any) => {
        const avaliacao = avaliacoes.find((a: any) => a.jogo === jogo._id);
        const nota = avaliacao?.nota ?? 'N/A';

        return {
          id: jogo._id,
          nome: jogo.nome,
          ano: jogo.ano,
          foto: jogo.foto,
          score: `${nota} ⭐`,
        };
      });

      setProducts(produtosComScore);
      setLoading(false);
    } catch (error) {
      logger.error('[List] Erro ao buscar dados de jogos/avaliações:', error);
      if (retryCount < MAX_RETRY) {
        setTimeout(() => {
          setRetryCount(retryCount + 1);
          fetchData();
        }, 1000);
      } else {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    const fetchAll = async () => {
      await fetchData();
      const token = await AsyncStorage.getItem('token');
      setIsLoggedIn(!!token);
    };

    fetchAll();
  }, []);

  const filteredProducts = products.filter((product) =>
    product.nome.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Cálculo de cards invisíveis para preencher a última linha
  const remainder = filteredProducts.length % numColumns;
  const fillers = remainder === 0 ? 0 : numColumns - remainder;
  const invisibleCards = Array(fillers).fill(null);

  return (
    <View style={[globalStyles.container, { backgroundColor: colors.backgroundBase }]}>
      <HeaderLayout title="Jogos" scrollable={false}>
        <View style={globalStyles.containerPadding}>
          <SearchBar
            placeholder="Pesquisar jogos..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />

          {loading ? (
            <LoadingIndicator />
          ) : filteredProducts.length > 0 ? (
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                paddingVertical: 16,
                paddingHorizontal: 12,
                flexDirection: 'row',
                flexWrap: 'wrap',
                rowGap: CARD_GAP,
                columnGap: CARD_GAP,
                justifyContent: numColumns === 1 ? 'center' : 'space-between',
              }}>
              {filteredProducts.map((item) => (
                <GameCard
                  key={item.id}
                  game={item}
                  onPress={() => router.push(`./boardgame/${item.id}`)}
                />
              ))}
              {invisibleCards.map((_, index) => (
                <View
                  key={`filler-${index}`}
                  style={{
                    width: CARD_WIDTH,
                    height: 0,
                    opacity: 0,
                    marginBottom: 0,
                  }}
                />
              ))}
            </ScrollView>
          ) : !isLoggedIn ? (
            <View style={{ padding: 24, alignItems: 'center' }}>
              <Text style={{ fontSize: 48, marginBottom: 12 }}>🔒</Text>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 16,
                  color: colors.textOnBase,
                  fontFamily,
                  marginBottom: 16,
                }}>
                Para adicionar um novo jogo, faça login na sua conta.
              </Text>
              <ButtonHighlight title="Fazer Login" onPress={() => router.push('/login')} />
            </View>
          ) : (
            <NoResults
              message="Jogo não encontrado. Deseja adicioná-lo?"
              actionText="Adicionar"
              onAction={() => router.push('/boardgame/registerGame')}
            />
          )}
        </View>
      </HeaderLayout>
    </View>
  );
}
