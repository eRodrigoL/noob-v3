// theme/global/theme.ts

// Definição da paleta de cores para a aplicação
const theme = {
  // Tema claro
   light: {
    name: 'Light',
    backgroundBase: '#F8FFFE', // fundo do corpo da tela
    backgroundSemiHighlight: '#FFFFFF', // fundo de componentes neutros (botões secundários, inputs, etc.)
    backgroundHighlight: '#F35B04', // fundo de componentes em destaque (botões primários, cabeçalhos, etc.)
    textHighlight: '#00004C', // texto em destaque no fundo padrão / (revisar) não identifiquei diferença ao altear a cor
    textOnBase: '#00004C', // texto no fundo padrão
    textOnSemiHighlight: '#5759B2', // texto no fundo semidestacado
    textOnHighlight: '#FFFFFF', // texto no fundo destacado
    border: '#00004C', // cor de bordas (inputs, cards, etc.)
    shadow: 'rgba(0, 0, 0, 0.1)', // sombra suave
    overlay: 'rgba(0, 0, 0, 0.5)', // novo: fundo para sobreposições
    accentColor: '#00004C', // Adc: ícones ou pequenos detalhes
  },

  // Tema escuro com cores escolhidas
dark: {
  name: 'Dark',
  backgroundBase: '#1C1C1E', // Fundo principal
  backgroundSemiHighlight: '#3A3A3C', // Fundo neutro
  backgroundHighlight: '#F35B04', // Destaque principal
  textHighlight: '#F8FFFE', // Texto em destaque
  textOnBase: '#FFFFFF', // Texto no fundo principal
  textOnSemiHighlight: '#F7B801', // Texto no fundo semi-destacado
  textOnHighlight: '#000000', // Texto no fundo destacado
  border: '#F18701', // Bordas
  shadow: 'rgba(0, 0, 0, 0.7)', // Sombra
  overlay: 'rgba(255, 255, 255, 0.2)', // Sobreposições
},

  // Tema para daltônicos
daltonic: {
  name: 'Daltonic 1',
  backgroundBase: '#383428', // Fundo principal
  backgroundSemiHighlight: '#3D7461', // Fundo neutro
  backgroundHighlight: '#F14B1B', // Destaque principal
  textHighlight: '#FFFFFF', // Texto em destaque
  textOnBase: '#FFFFFF', // Texto no fundo principal
  textOnSemiHighlight: '#83A279', // Texto no fundo semi-destacado
  textOnHighlight: '#000000', // Texto no fundo destacado
  border: '#FDFDFD', // Bordas claras para contraste
  shadow: 'rgba(0, 0, 0, 0.7)', // Sombra
  overlay: 'rgba(255, 255, 255, 0.2)', // Sobreposições
},

daltonic_2: {
  name: 'Daltonic 2',
  backgroundBase: '#242E3A', // Fundo principal
  backgroundSemiHighlight: '#1B3C72', // Fundo neutro
  backgroundHighlight: '#F5754E', // Destaque principal
  textHighlight: '#FFFFFF', // Texto em destaque
  textOnBase: '#FFFFFF', // Texto no fundo principal
  textOnSemiHighlight: '#F6BC1D', // Texto no fundo semi-destacado
  textOnHighlight: '#000000', // Texto no fundo destacado
  border: '#A49F8C', // Bordas
  shadow: 'rgba(0, 0, 0, 0.7)', // Sombra
  overlay: 'rgba(255, 255, 255, 0.2)', // Sobreposições
},

daltonic_3: {
  name: 'Daltonic 3',
  backgroundBase: '#2B3131', // Fundo principal
  backgroundSemiHighlight: '#2857BF', // Fundo neutro
  backgroundHighlight: '#3EA74B', // Destaque principal
  textHighlight: '#FFFFFF', // Texto em destaque
  textOnBase: '#FFFFFF', // Texto no fundo principal
  textOnSemiHighlight: '#F5AC07', // Texto no fundo semi-destacado
  textOnHighlight: '#000000', // Texto no fundo destacado
  border: '#FBE3B5', // Bordas
  shadow: 'rgba(0, 0, 0, 0.7)', // Sombra
  overlay: 'rgba(255, 255, 255, 0.2)', // Sobreposições
},



};

// Exporta o objeto theme para ser usado em outros arquivos
export default theme;
