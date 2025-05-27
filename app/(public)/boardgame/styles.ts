//app/(app)/(public)/boardgame/styles.ts
import { StyleSheet } from 'react-native';

const stylesListGame = StyleSheet.create({
  card: {
    width: '45%', // Define a largura do cartão
    borderRadius: 8, // Define o raio da borda para cantos arredondados
    padding: 10, // Define o preenchimento interno do cartão
    marginBottom: 10, // Define a margem inferior
    marginHorizontal: 10, // Define a margem horizontal
    alignItems: 'center', // Alinha o conteúdo ao centro horizontalmente
    shadowOffset: { width: 0, height: 2 }, // Define o deslocamento da sombra
    shadowOpacity: 0.1, // Define a opacidade da sombra
    shadowRadius: 5, // Define o raio da sombra
    elevation: 5, // Define a elevação para dispositivos Android
  },

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
    marginBottom: 5,
  },
  productRating: {
    fontSize: 14,
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
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default stylesListGame;
