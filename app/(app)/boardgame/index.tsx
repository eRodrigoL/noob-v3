// app/(app)/boardgame/index.tsx
import { GameCard, HeaderLayout, LoadingIndicator, NoResults, SearchBar } from '@components/index';
import { logger } from '@lib/logger';
import { apiClient } from '@services/apiClient';
import { globalStyles, useTheme } from '@theme/index';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, useWindowDimensions, View } from 'react-native';

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
  const { colors } = useTheme();
  const { width } = useWindowDimensions();

  const numColumns = width >= 1000 ? 4 : width >= 700 ? 3 : width >= 500 ? 2 : 1;

  const MAX_RETRY = 10;

  // TODO: @motathais Veja se você consegue fazer a leitura das notas funcionar
  // TENTATIVA 2
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
    fetchData();
  }, []);

  const filteredProducts = products.filter((product) =>
    product.nome.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Agora GameCard é um componente reutilizável!
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
            contentContainerStyle={{
              gap: 12,
            }}
            numColumns={numColumns}
            columnWrapperStyle={numColumns > 1 ? { gap: 12 } : undefined}
            showsVerticalScrollIndicator={false}
          />
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
