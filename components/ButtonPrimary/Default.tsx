import { StyleSheet } from 'react-native'; // Importa o módulo StyleSheet do React Native para criar estilos
import { Theme } from './Theme'; // Importa o tema de cores para o estilo do aplicativo

// Cria um objeto de estilos usando StyleSheet
const styles = StyleSheet.create({
  container: {
    flex: 1, // Ocupa todo o espaço disponível
    justifyContent: 'center', // Centraliza o conteúdo verticalmente
    alignItems: 'center', // Centraliza o conteúdo horizontalmente
    backgroundColor: Theme.light.background, // Define a cor de fundo com base no tema
  },
  title: {
    marginTop: 20,
    fontSize: 46, // Define o tamanho da fonte do título
    fontWeight: 'bold', // Define a espessura da fonte como negrito
    color: Theme.light.text, // Define a cor do texto com base no tema
    marginBottom: 40, // Define a margem inferior
  },
  diceIcon: {
    fontSize: 48, // Define o tamanho da fonte do ícone de dado
  },
  label: {
    fontSize: 18, // Define o tamanho da fonte do rótulo
    color: Theme.light.text, // Define a cor do texto com base no tema
    alignSelf: 'flex-start', // Alinha o rótulo ao início do contêiner
    marginLeft: '5%', // Define a margem esquerda
    marginBottom: 8, // Define a margem inferior
  },
  customLabel: {
    //criei para alguns pontos especificos
    fontSize: 20, //Define o tamanho da fonte do rótulo
    color: '000000', // Vermelho, por exemplo
    alignSelf: 'flex-start', // Alinha o rótulo ao início do contêiner
    marginLeft: '5%', // Define a margem esquerda
    fontWeight: 'bold', //O texto será exibido com uma aparência mais "forte", ou seja, com letras mais grossas
    marginBottom: 8, // Define a margem inferior
  },

  input: {
    width: '80%', // Define a largura do campo de entrada
    height: 40, // Define a altura do campo de entrada
    borderColor: Theme.light.imput, // Define a cor da borda do campo de entrada com base no tema
    borderWidth: 1, // Define a largura da borda
    borderRadius: 5, // Define o raio da borda para cantos arredondados
    paddingHorizontal: 10, // Define o preenchimento horizontal interno
    marginBottom: 20, // Define a margem inferior
  },
  buttonPrimary: {
    width: '80%', // Define a largura do botão primário
    height: 50, // Define a altura do botão primário
    backgroundColor: Theme.light.backgroundButton, // Define a cor de fundo do botão primário com base no tema
    justifyContent: 'center', // Centraliza o conteúdo verticalmente dentro do botão
    alignItems: 'center', // Centraliza o conteúdo horizontalmente dentro do botão
    borderRadius: 5, // Define o raio da borda para cantos arredondados
    marginTop: 20, // Define a margem superior
    marginBottom: 20, // Define a margem inferior
  },
  buttonPrimaryText: {
    color: Theme.light.textButton, // Define a cor do texto do botão primário com base no tema
    fontSize: 18, // Define o tamanho da fonte do texto do botão
    fontWeight: 'bold', // Define a espessura da fonte como negrito
  },
  buttonSecondary: {
    width: '80%', // Define a largura do botão primário
    height: 50, // Define a altura do botão primário
    backgroundColor: Theme.light.secondary.background, // Define a cor de fundo do botão primário com base no tema
    justifyContent: 'center', // Centraliza o conteúdo verticalmente dentro do botão
    alignItems: 'center', // Centraliza o conteúdo horizontalmente dentro do botão
    borderRadius: 5, // Define o raio da borda para cantos arredondados
    marginTop: 20, // Define a margem superior
    marginBottom: 20, // Define a margem inferior
  },
  buttonSecondaryText: {
    color: Theme.light.secondary.text, // Define a cor do texto do botão primário com base no tema
    fontSize: 18, // Define o tamanho da fonte do texto do botão
    fontWeight: 'bold', // Define a espessura da fonte como negrito
  },
  signupText: {
    color: Theme.light.text, // Define a cor do texto de cadastro com base no tema
    fontSize: 16, // Define o tamanho da fonte do texto de cadastro
  },
  signupLink: {
    color: Theme.light.link, // Define a cor do link de cadastro com base no tema
    fontWeight: 'bold',
    fontSize: 16, // Define a espessura da fonte como negrito
  },
  profileImageContainer: {
    width: 120, // Define a largura do contêiner da imagem de perfil
    height: 120, // Define a altura do contêiner da imagem de perfil
    borderRadius: 60, // Define o raio da borda para criar um círculo
    backgroundColor: Theme.light.secondary.backgroundButton, // Define a cor de fundo do contêiner da imagem de perfil
    justifyContent: 'center', // Centraliza o conteúdo verticalmente
    alignItems: 'center', // Centraliza o conteúdo horizontalmente
    marginBottom: 20, // Define a margem inferior
    alignSelf: 'center', // Centraliza o contêiner horizontalmente
  },
  profileImage: {
    width: 120, // Define a largura da imagem de perfil
    height: 120, // Define a altura da imagem de perfil
    borderRadius: 60, // Define o raio da borda para criar um círculo
  },
  profileImagePlaceholder: {
    color: '#fff', // Define a cor do texto de espaço reservado na imagem de perfil
    fontSize: 16, // Define o tamanho da fonte do texto de espaço reservado
  },
  searchBar: {
    height: 40, // Define a altura da barra de pesquisa
    borderColor: Theme.light.borda, // Define a cor da borda da barra de pesquisa com base no tema
    borderWidth: 1, // Define a largura da borda da barra de pesquisa
    borderRadius: 10, // Define o raio da borda para cantos arredondados
    paddingHorizontal: 10, // Define o preenchimento horizontal interno da barra de pesquisa
    margin: 10, // Define a margem em todas as direções
  },
  card: {
    width: '45%', // Define a largura do cartão
    backgroundColor: Theme.light.backgroundCard, // Define a cor de fundo do cartão com base no tema
    borderRadius: 8, // Define o raio da borda para cantos arredondados
    padding: 10, // Define o preenchimento interno do cartão
    marginBottom: 10, // Define a margem inferior
    marginHorizontal: 10, // Define a margem horizontal
    alignItems: 'center', // Alinha o conteúdo ao centro horizontalmente
    shadowColor: Theme.light.text, // Define a cor da sombra do cartão com base no tema
    shadowOffset: { width: 0, height: 2 }, // Define o deslocamento da sombra
    shadowOpacity: 0.1, // Define a opacidade da sombra
    shadowRadius: 5, // Define o raio da sombra
    elevation: 5, // Define a elevação para dispositivos Android
  },
  labelNegrito: {
    fontSize: 18, // Define o tamanho da fonte do rótulo
    color: Theme.light.text, // Define a cor do texto com base no tema
    alignSelf: 'flex-start', // Alinha o rótulo ao início do contêiner
    marginLeft: '5%', // Define a margem esquerda
    marginBottom: 8, // Define a margem inferior
    fontWeight: 'bold',
  },
});

// Exporta o objeto de estilos para uso em outros componentes
export default styles;
