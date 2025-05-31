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
        // Pega todas as avaliações com o mesmo id de jogo
        const avaliacoesDoJogo = avaliacoes.filter((a: any) => a.jogo === jogo._id);

        // Calcula a média das notas, se houver alguma
        const mediaNota =
          avaliacoesDoJogo.length > 0
            ? (
              avaliacoesDoJogo.reduce((soma: number, a: any) => soma + (a.nota || 0), 0) /
              avaliacoesDoJogo.length
            ).toFixed(1)
            : 'N/A';

        return {
          id: jogo._id,
          titulo: jogo.titulo,
          ano: jogo.ano,
          capa: jogo.capa,
          score: `${mediaNota} ⭐`,
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


  // TENTATIVA 1
  // const fetchData = async () => {
  //   try {
  //     const jogosResponse = await apiClient.get('/jogos');
  //     const produtos = jogosResponse.data;

  //     const produtosComScore = await Promise.all(
  //       produtos.map(async (jogo: any) => {
  //         try {
  //           // Busca a avaliação usando o ID do jogo como parâmetro "jogo"
  //           const avaliacoesResponse = await apiClient.get(`/avaliacoes?jogo=${jogo._id}`);

  //           // Supondo que a API retorna um array de avaliações para o jogo
  //           const avaliacaoDoJogo = avaliacoesResponse.data.find(
  //             (avaliacao: any) => avaliacao.jogo === jogo._id
  //           );

  //           // Se existir avaliação, pega a nota, senão 0
  //           const nota = avaliacaoDoJogo?.nota || 0;

  //           return {
  //             id: jogo._id,
  //             titulo: jogo.titulo,
  //             ano: jogo.ano,
  //             capa: jogo.capa,
  //             score: `${nota} ⭐`,
  //           };
  //         } catch (e) {
  //           return {
  //             id: jogo._id,
  //             titulo: jogo.titulo,
  //             ano: jogo.ano,
  //             capa: jogo.capa,
  //             score: '0 ⭐',
  //           };
  //         }
  //       })
  //     );

  //     setProducts(produtosComScore);
  //     setLoading(false);
  //   } catch (error) {
  //     logger.error('[List] Erro ao buscar dados:', error);
  //     if (retryCount < MAX_RETRY) {
  //       setTimeout(() => {
  //         setRetryCount(retryCount + 1);
  //         fetchData();
  //       }, 1000);
  //     } else {
  //       setLoading(false);
  //     }
  //   }
  // };

  // RANDÔMICO
  // const fetchData = async () => {
  //   try {
  //     const response = await apiClient.get('/jogos');
  //     const updatedProducts = response.data.map((item: any) => ({
  //       id: item._id,
  //       titulo: item.titulo,
  //       ano: item.ano,
  //       capa: item.capa,
  //       score: Math.floor(Math.random() * 101) + ' ⭐',
  //     }));
  //     setProducts(updatedProducts);
  //     setLoading(false);
  //   } catch (error: unknown) {
  //     logger.error('Erro ao buscar os dados da API:', error);
  //     if (retryCount < MAX_RETRY) {
  //       setTimeout(() => {
  //         setRetryCount(retryCount + 1);
  //         fetchData();
  //       }, 1000);
  //     } else {
  //       setLoading(false);
  //     }
  //   }
  // };

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
