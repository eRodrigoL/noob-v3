// theme/global/theme.ts

// Definição da paleta de cores para a aplicação

// Define o tema "ligth" (tema claro)

const theme = {

light: {
    name: 'Light',
    backgroundBase: '#F8F8F8', // Cor de fundo principal: Cinza claro sofisticado (para uma base neutra)
    backgroundSemiHighlight: '#DADADA', // Cor para destaque secundário: Cinza médio (para contraste suave)
    backgroundHighlight: '#F35B04', // Cor para destaque principal: Laranja quente e vibrante
    textHighlight: '#00004C', // Cor para texto destacado
    textOnBase: '#000000', // Cor para texto sobre o fundo principal
    textOnSemiHighlight: '#3D348B', // Cor para texto sobre o destaque secundário: Azul profundo, criando contraste...
    textOnHighlight: '#FFFFFF', // Cor para texto sobre o destaque principal: Branco para ter um contraste nítido
    border: '#5759B2', // Cor para bordas
    shadow: 'rgba(0, 0, 0, 0.15)', // Sombra: Sutil para adicionar profundidade
    overlay: 'rgba(0, 0, 0, 0.3)', // Sobreposição: Transparência discreta pensando em ter foco
    accentColor: '#F7B801', // Cor de destaque adicional: Amarelo para elementos chamativos
},

  
  // Define o tema "dark" (tema escuro)

  dark: {
    name: 'Dark',
    backgroundBase: '#1E1E24',
    backgroundSemiHighlight: '#FFB27A',
    backgroundHighlight: '#F35B04',
    textHighlight: '#FFFFFF',
    textOnBase: '#FFEE93',
    textOnSemiHighlight: '#00004C',
    textOnHighlight: '#FFFFFF',
    border: '#F18701',
    shadow: 'rgba(0, 0, 0, 0.8)',
    overlay: 'rgba(255, 255, 255, 0.1)',
    accentColor: '#FF6B6B',
},

  // Define o tema "daltonic" (daltônico 1)

 daltonic: {
    name: 'Daltonic 1',
    backgroundBase: '#383428',
    backgroundSemiHighlight: '#3D7461',
    backgroundHighlight: '#F14B1B',
    textHighlight: '#FFFFFF',
    textOnBase: '#FFFFFF',
    textOnSemiHighlight: '#83A279',
    textOnHighlight: '#000000',
    border: '#B0B0B0',
    shadow: 'rgba(0, 0, 0, 0.7)',
    overlay: 'rgba(255, 255, 255, 0.2)',
    accentColor: '#B0B0B0',
},

  // Define o tema "daltonic_2" (daltônico 2)

daltonic_2: {
    name: 'Daltonic 2',
    backgroundBase: '#1B3C72',
    backgroundSemiHighlight: '#F5754E',
    backgroundHighlight: '#F6BC1D',
    textHighlight: '#FFFFFF',
    textOnBase: '#FFFFFF',
    textOnSemiHighlight: '#1B3C72',
    textOnHighlight: '#000000',
    border: '#A49F8C',
    shadow: 'rgba(0, 0, 0, 0.4)',
    overlay: 'rgba(255, 255, 255, 0.25)',
    accentColor: '#F6BC1D',
},


  // Define o tema "daltonic_3" (daltônico 3)
  
 daltonic_3: {
    name: 'Daltonic 3',
    backgroundBase: '#2B3131',
    backgroundSemiHighlight: '#2857BF',
    backgroundHighlight: '#3EA74B',
    textHighlight: '#FFFFFF',
    textOnBase: '#FFFFFF',
    textOnSemiHighlight: '#F5AC07',
    textOnHighlight: '#000000',
    border: '#FBE3B5',
    shadow: 'rgba(0, 0, 0, 0.7)',
    overlay: 'rgba(255, 255, 255, 0.2)',
    accentColor: '#FBE3B5',
},
};

// Exporta o objeto "theme" para ser usado em outras partes do código
export default theme;
