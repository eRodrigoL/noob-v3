// components/SandwichMenu/Theme.ts

// Define um objeto Colors que contém as cores utilizadas no tema
const Colors = {
  orange: '#FF8C00', // Cor laranja para botões e links
  white: '#fff', // Cor branca para textos ou planos de fundo
  whiteSmoke: '#F5F5F5', // Cor de fundo padrão do tema claro
  gray: '#ccc', // Cor cinza usada para inputs ou elementos secundários
  black: '#000', // Cor preta usada para textos principais
};

// Exporta um objeto Theme que define o tema claro e escuro da aplicação
export const Theme = {
  // Tema claro
  light: {
    background: Colors.whiteSmoke,
    backgroundButton: Colors.orange,
    backgroundHeader: Colors.orange,
    backgroundCard: Colors.white,
    text: Colors.black,
    textButton: Colors.white,
    imput: Colors.gray,
    link: Colors.orange,
    borda: Colors.orange,
    secondary: {
      background: Colors.gray,
      backgroundButton: Colors.gray,
      text: Colors.white,
    },
  },

  // Tema escuro (ainda não definido)
  dark: {},
};
