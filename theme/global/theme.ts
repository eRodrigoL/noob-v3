// theme/global/theme.ts

// Definição da paleta de cores para a aplicação

// Define o tema "ligth" (tema claro)

const theme = {

  light: {
    name: 'Light',
    backgroundBase: '#FDF6E3', // Fundo bege claro e quente
    backgroundSemiHighlight: '#FFE3B0', // Destaque secundário em tom pastel de laranja
    backgroundHighlight: '#F35B04', // Cor principal vibrante
    textHighlight: '#5759B2', // Texto com contraste em azul profundo
    textOnBase: '#3D348B', // Texto sobre fundo claro em tom escuro
    textOnSemiHighlight: '#00004C', // Texto sobre destaques secundários
    textOnHighlight: '#FFFFFF', // Texto branco sobre destaque principal
    border: '#FFA726', // Bordas em tom alegre de laranja
    shadow: 'rgba(0, 0, 0, 0.1)', // Sombra leve
    overlay: 'rgba(0, 0, 0, 0.5)', // Sobreposição semi-transparente
    accentColor: '#FFA726', // Cor adicional vibrante
},


  
  // Define o tema "dark" (tema escuro)

  dark: {
    name: 'Dark', // Nome do tema
    backgroundBase: '#1E1E24', // Fundo escuro quente
    backgroundSemiHighlight: '#FFB27A', // Destaque secundário laranja claro
    backgroundHighlight: '#F35B04', // Destaque principal
    textHighlight: '#FFFFFF', // Texto branco para contraste
    textOnBase: '#FFEE93', // Texto vibrante em amarelo
    textOnSemiHighlight: '#00004C', // Azul profundo para destaques
    textOnHighlight: '#FFFFFF', // Texto branco sobre destaque
    border: '#F18701', // Bordas laranja claro
    shadow: 'rgba(0, 0, 0, 0.8)', // Sombra intensa
    overlay: 'rgba(255, 255, 255, 0.1)', // Sobreposição clara
    accentColor: '#FF6B6B', // Vermelho vibrante
  },

  // Define o tema "daltonic" (daltônico 1)

  daltonic: {
      name: 'Daltonic 1',
      backgroundBase: '#383428', // Fundo principal escuro
      backgroundSemiHighlight: '#3D7461', // Fundo de destaque secundário (verde)
      backgroundHighlight: '#F14B1B', // Destaque principal (vermelho queimado)
      textHighlight: '#FFFFFF', // Texto destacado
      textOnBase: '#FFFFFF', // Texto sobre o fundo principal
      textOnSemiHighlight: '#83A279', // Texto sobre fundo secundário
      textOnHighlight: '#000000', // Texto sobre destaque principal
      border: '#B0B0B0', // Cor de borda neutra
      shadow: 'rgba(0, 0, 0, 0.7)',
      overlay: 'rgba(255, 255, 255, 0.2)',
      accentColor: '#B0B0B0', // Cor de destaque adicional
  },

  // Define o tema "daltonic_2" (daltônico 2)

  daltonic_2: {
    name: 'Daltonic 2', 
    backgroundBase: '#1B3C72', // Azul profundo
    backgroundSemiHighlight: '#F5754E', // Laranja enérgico
    backgroundHighlight: '#F6BC1D', // Amarelo radiante
    textHighlight: '#FFFFFF', // Branco para contraste
    textOnBase: '#FFFFFF', // Texto claro
    textOnSemiHighlight: '#1B3C72', // Azul sobre laranja
    textOnHighlight: '#000000', // Preto sobre amarelo
    border: '#A49F8C', // Bordas equilibradas
    shadow: 'rgba(0, 0, 0, 0.4)', // Sombra discreta
    overlay: 'rgba(255, 255, 255, 0.25)', // Sobreposição moderna
    accentColor: '#F6BC1D', // Amarelo como destaque
},


  // Define o tema "daltonic_3" (daltônico 3)
  
  daltonic_3: {
    name: 'Daltonic 3', // Nome do tema
    backgroundBase: '#2B3131', // Cor de fundo principal
    backgroundSemiHighlight: '#2857BF', // Cor para destaque secundário
    backgroundHighlight: '#3EA74B', // Cor para destaque principal
    textHighlight: '#FFFFFF', // Cor para texto destacado
    textOnBase: '#FFFFFF', // Cor para texto sobre o fundo principal
    textOnSemiHighlight: '#F5AC07', // Cor para texto sobre o destaque secundário
    textOnHighlight: '#000000', // Cor para texto sobre o destaque principal
    border: '#FBE3B5', // Cor para bordas
    shadow: 'rgba(0, 0, 0, 0.7)', // Cor para sombras (mais escura)
    overlay: 'rgba(255, 255, 255, 0.2)', // Cor para sobreposições (transparente clara)
    accentColor: '#FBE3B5', // Cor de destaque adicional
  },
};

// Exporta o objeto "theme" para ser usado em outras partes do código
export default theme;
