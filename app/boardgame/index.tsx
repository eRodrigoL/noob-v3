// app/(app)/(public)/boardgame/index.tsx
import { ButtonHighlight, GameCard, HeaderLayout, LoadingIndicator, NoResults, SearchBar } from '@components/index';
import { logger } from '@lib/logger';
import { apiClient } from '@services/apiClient';
import { globalStyles, useTheme } from '@theme/index';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { storage } from '@store/storage';
import axios from 'axios';
import { FlatList, useWindowDimensions, View, Text, StyleSheet } from 'react-native';


interface Product {
  id: string;
  nome: string;
  ano?: number;
  capa?: string;
  score: string;
}

export default function List() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [retryCount, setRetryCount] = useState<number>(0);
  const { colors, fontFamily } = useTheme();
  const { width } = useWindowDimensions();


  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);


  useEffect(() => {
    const checkAuth = async () => {
      const token = await storage.getItem('token');
      setIsLoggedIn(!!token);
    };
    checkAuth();
  }, []);


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
          capa: jogo.capa,
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
        ) : isLoggedIn ? (
          <NoResults
            message="Jogo não encontrado. Deseja adicioná-lo?"
            actionText="Adicionar"
            onAction={() => router.push('/boardgame/RegisterGame')}
          />
        ) : (
          <View style={styles.alertContainer}>
            <Text style={[globalStyles.textCenteredBold, { fontSize: 48, fontFamily, marginBottom: 12 }]}>
              🎲
            </Text>
            <Text
              style={{
                textAlign: 'center',
                fontSize: 16,
                color: colors.textOnBase,
                fontFamily,
                marginBottom: 16,
              }}>
              Para cadastrar novos jogos é necessário estar logado.
            </Text>
            <ButtonHighlight title="Fazer Login" onPress={() => router.push('/login')} />
          </View>
        )}
      </HeaderLayout>
    </View>
  );
};

const styles = StyleSheet.create({
  alertContainer: {
    borderRadius: 12,
    padding: 16,
    margin: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
});
