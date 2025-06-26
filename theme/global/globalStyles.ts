// theme/glogal/globalStyles.ts

// Importa a função StyleSheet do React Native para criar estilos
import { StyleSheet } from 'react-native';

// Define um objeto de estilos globais usando StyleSheet.create
const globalStyles = StyleSheet.create({
  // Botão genérico base
  button: {
    alignItems: 'center', // Centraliza o conteúdo horizontalmente dentro do botão
    borderRadius: 5, // Define o raio da borda para cantos arredondados
    justifyContent: 'center', // Centraliza o conteúdo verticalmente dentro do botão
    margin: 5, // Margem de 20 unidades de todos os lados
    padding: 10, // Adiciona um preenchimento interno de 10 unidades em todos os lados
  },

  buttonSmall: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },

  card: {
    borderRadius: 8,
    elevation: 2, // Android
    shadowColor: '#000', // iOS/Web
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    padding: 15,
    marginVertical: 10,
  },

  centered: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },

  // Container princípal das telas
  container: {
    flex: 1, // Ocupa todo o espaço disponível na tela
  },

  containerPadding: {
    flex: 1,
    paddingTop: 20,
    paddingLeft: 20,
    paddingRight: 20,
  },

  containerCentered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },

  containerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },

  // Imagens
  imageRounded: {
    width: 100,
    height: 100,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  imageCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    resizeMode: 'cover',
  },
  imageFullWidth: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
  },
  loadingImage: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    marginBottom: 20,
  },

  // Inputs
  input: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  inputSmall: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
  },

  // Switch e elementos horizontais
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  //textos
  // Texto centralizado (exp.: botões secundários, descrições de imagens e gráficos, etc.)
  textCentered: {
    fontWeight: 'normal',
    textAlign: 'center',
  },

  // Texto centralizado e em negrito (usado para títulos, destaque, botões principais)
  textCenteredBold: {
    fontWeight: 'bold',
    textAlign: 'center',
  },

  // Texto justificado e normal (exp.: textos simples, descrições, textos longos, etc.)
  textJustified: {
    fontWeight: 'normal',
    textAlign: 'justify',
  },

  // Texto justificado e em negrito (exp.: subtítulos, etc.)
  textJustifiedBold: {
    fontWeight: 'bold',
    textAlign: 'justify',
  },

  // Texto justificado e em negrito (exp.: subtítulos, etc.)
  textJustifiedBoldItalic: {
    fontStyle: 'italic',
    fontWeight: 'bold',
    textAlign: 'justify',
  },

  // tag
  tagContainer: {
    flexDirection: 'row',
    marginVertical: 10,
  },

  tag: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    alignItems: 'center',
    marginRight: 10,
  },

  // switch
  switch: {
    transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }],
    marginRight: 10,
  },
});

// Exporta o objeto de estilos globais para ser usado em outros componentes
export default globalStyles;
