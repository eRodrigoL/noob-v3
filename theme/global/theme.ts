// theme/global/theme.ts

// Definição da paleta de cores para a aplicação
const theme = {
  // Tema claro
  light: {
    name: 'light',
    backgroundBase: '#F2F2F7', // fundo do corpo da tela
    backgroundSemiHighlight: '#636363', // fundo de componentes neutros (botões secundários, inputs, etc.)
    backgroundHighlight: '#734500', // fundo de componentes em destaque (botões primários, cabeçalhos, etc.)
    textHighlight: '#734500', // texto em destaque no fundo padrão
    textOnBase: '#000000', // texto no fundo padrão
    textOnSemiHighlight: '#FFFFFF', // texto no fundo semidestacado
    textOnHighlight: '#FFFFFF', // texto no fundo destacado
    border: '#C7C7CC', // cor de bordas (inputs, cards, etc.)
    shadow: 'rgba(0, 0, 0, 0.1)', // sombra suave
    overlay: 'rgba(0, 0, 0, 0.5)', // novo: fundo para sobreposições
  },

  // Tema escuro
  dark: {
    name: 'dark',
    backgroundBase: '#1C1C1E',
    backgroundSemiHighlight: '#3A3A3C',
    backgroundHighlight: '#0A84FF',
    textHighlight: '#0A84FF',
    textOnBase: '#FFFFFF',
    textOnSemiHighlight: '#FFFFFF',
    textOnHighlight: '#000000',
    border: '#48484A',
    shadow: 'rgba(0, 0, 0, 0.7)',
    overlay: 'rgba(255, 255, 255, 0.2)',
  },

  // Tema para daltônicos
  daltonic: {
    name: 'daltonic',
    backgroundBase: '#FDFDFD',
    backgroundSemiHighlight: '#7A9E9F', // tom azul-esverdeado para contraste seguro
    backgroundHighlight: '#F5A623', // laranja vivo e seguro para daltônicos
    textHighlight: '#F5A623',
    textOnBase: '#000000',
    textOnSemiHighlight: '#FFFFFF',
    textOnHighlight: '#000000',
    border: '#B0B0B0',
    shadow: 'rgba(50, 50, 50, 0.2)',
    overlay: 'rgba(0, 0, 0, 0.4)',
  },
};

// Exporta o objeto theme para ser usado em outros arquivos
export default theme;
