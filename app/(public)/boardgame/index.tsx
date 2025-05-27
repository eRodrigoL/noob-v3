// app/(app)/(public)/boardgame/index.tsx
import { GameCard, HeaderLayout, LoadingIndicator, NoResults, SearchBar } from '@components/index';
import { logger } from '@lib/logger';
import { apiClient } from '@services/apiClient';
import { globalStyles, useTheme } from '@theme/index';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, useWindowDimensions, View } from 'react-native';

interface Product {
  id: string;
  titulo: string;
  ano?: number;
  capa?: string;
  rating: string;
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

  const fetchData = async () => {
    try {
      const response = await apiClient.get('/jogos');
      const updatedProducts = response.data.map((item: any) => ({
        id: item._id,
        titulo: item.titulo,
        ano: item.ano,
        capa: item.capa,
        rating: Math.floor(Math.random() * 101) + ' ⭐',
      }));
      setProducts(updatedProducts);
      setLoading(false);
    } catch (error: unknown) {
      logger.error('Erro ao buscar os dados da API:', error);
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
    product.titulo.toLowerCase().includes(searchQuery.toLowerCase())
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
              padding: 12,
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
            onAction={() => router.push('/boardgameOld/RegisterGame')}
          />
        )}
      </HeaderLayout>
    </View>
  );
}
