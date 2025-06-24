// app/(app)/boardgame/index.tsx
import {
  GameCard,
  HeaderLayout,
  LoadingIndicator,
  NoResults,
  SearchBar,
  ButtonHighlight,
} from '@components/index';
import { logger } from '@lib/logger';
import { apiClient } from '@services/apiClient';
import { globalStyles, useTheme } from '@theme/index';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  useWindowDimensions,
  View,
  Text,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Product {
  id: string;
  nome: string;
  ano?: number;
  foto?: string;
  score: string;
}

export default function List() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [retryCount, setRetryCount] = useState<number>(0);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const { width } = useWindowDimensions();
  const { colors, fontFamily, fontSizes } = useTheme();

  const numColumns = width >= 1000 ? 4 : width >= 700 ? 3 : width >= 500 ? 2 : 1;
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

  const renderProduct = ({ item }: { item: Product }) => (
    <GameCard game={item} onPress={() => router.push(`./boardgame/${item.id}`)} />
  );

  return (
    <View style={[globalStyles.container, { backgroundColor: colors.backgroundBase }]}>
      <HeaderLayout title="Jogos" scrollable={false}>
        <SearchBar
          placeholder="Pesquisar jogos..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        {loading ? (
          <LoadingIndicator />
        ) : filteredProducts.length > 0 ? (
          <FlatList
            data={filteredProducts}
            key={numColumns}
            renderItem={renderProduct}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={{ gap: 12 }}
            numColumns={numColumns}
            columnWrapperStyle={numColumns > 1 ? { gap: 12 } : undefined}
            showsVerticalScrollIndicator={false}
          />
        ) : !isLoggedIn ? (
          <View style={{ padding: 24, alignItems: 'center' }}>
            <Text style={{ fontSize: 48, marginBottom: 12 }}>🔒</Text>
            <Text style={{
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
      </HeaderLayout>
    </View>
  );
}
