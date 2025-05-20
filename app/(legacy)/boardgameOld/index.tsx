// app/(legacy)/boardgameOld/index.tsx
import { ButtonHighlight, Header, SearchBar } from '@components/index';
import { images } from '@constants/images';
import { logger } from '@lib/logger';
import { apiClient } from '@services/apiClient';
import styles from '@theme/themOld/globalStyle';
import { Theme } from '@theme/themOld/theme';
import { useRouter } from 'expo-router'; // Hook de navegação
import React, { useEffect, useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Product {
  id: string;
  titulo: string;
  ano?: number;
  capa?: string;
  rating: string;
}

export default function List() {
  const router = useRouter(); // Instância do roteador
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [retryCount, setRetryCount] = useState<number>(0);

  const MAX_RETRY = 10;

  const fetchData = async () => {
    try {
      const response = await apiClient.get('/jogos');
      const updatedProducts = response.data.map((item: any) => ({
        id: item._id, // Inclui o id do item
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

  const renderProduct = ({ item }: { item: Product }) => (
    <TouchableOpacity
      style={styles.card}
      // TODO: quando o caminho for app/(app)/boardgame/[id]/index.tsx trocar por -> router.push({ pathname: ROUTES.GAMES.DETAILS, params: { id: item.id } })
      onPress={() => router.push(`./boardgame/${item.id}`)}>
      <Image
        source={item.capa ? { uri: item.capa } : images.unavailable}
        style={localStyles.image}
      />
      <Text style={localStyles.productName}>
        {item.titulo} {item.ano ? `(${item.ano})` : ''}
      </Text>
      <Text style={localStyles.productRating}>{item.rating}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1 }}>
      <Header title="Jogos" />
      <SearchBar
        placeholder="Pesquisar jogos..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      {loading ? (
        <View style={localStyles.loadingContainer}>
          <Image source={images.loading} style={localStyles.loadingImage} />
          <Text>Carregando jogos...</Text>
        </View>
      ) : filteredProducts.length > 0 ? (
        <FlatList
          data={filteredProducts}
          renderItem={renderProduct}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={{ ...localStyles.container, flexGrow: 1 }}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
        />
      ) : (
        <View style={localStyles.noResultsContainer}>
          <Text style={localStyles.noResultsText}>Jogo não encontrado. Deseja adicioná-lo?</Text>
          {/* TODO: trocar o ROUTES  */}
          <ButtonHighlight
            title="Adicionar"
            onPress={() => router.push('/(legacy)/boardgameOld/RegisterGame')}
          />
        </View>
      )}
    </View>
  );
}

const localStyles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Theme.light.text,
    marginBottom: 5,
  },
  productRating: {
    fontSize: 14,
    color: Theme.light.borda,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingImage: {
    width: 100,
    height: 100,
    marginBottom: 20,
    resizeMode: 'contain',
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noResultsText: {
    fontSize: 18,
    color: Theme.light.text,
    marginBottom: 20,
    textAlign: 'center',
  },
});
