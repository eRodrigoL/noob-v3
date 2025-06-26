// theme/global/theme.ts

// Definição da paleta de cores para a aplicação

// Define o tema "ligth" (tema claro)

const theme = {
  //
  light: {
    name: 'Claro',
    backgroundBase: '#FAF5F0', // Cor de fundo principal
    backgroundSemiHighlight: '#F8E7D4', // Cor para destaque secundário
    backgroundHighlight: '#F35B04', // Cor para destaque principal
    input: '#5759B2',
    inputError: '#fc9aaf',
    textHighlight: '#00004C', // Cor para texto destacado
    textOnBase: '#000048', // Cor para texto sobre o fundo principal
    textOnSemiHighlight: '#3D348B', // Cor para texto sobre o destaque secundário
    textOnHighlight: '#FFFFFF', // Cor para texto sobre o destaque principal
    border: '#F35B04', // Cor para bordas
    shadow: 'rgba(0, 0, 0, 0.15)', // Sombra: Sutil para adicionar profundidade
    overlay: 'rgba(0, 0, 0, 0.3)', // Sobreposição: Transparência discreta pensando em ter foco
    accentColor: '#F7B801', // Cor de destaque adicional: Amarelo para elementos chamativos
    switchTrackOn: '#E0F7F6',
    switchTrackOff: '#fc9aaf',
    switchThumbOn: '#FFFFFF',
    switchThumbOff: '#F35B04',
  },

  // Define o tema "dark" (tema escuro)

  dark: {
    name: 'Escuro',
    backgroundBase: '#1E1E24',
    backgroundSemiHighlight: '#2E2B27',
    backgroundHighlight: '#602401',
    input: '#444654',
    inputError: '#A9313D',
    textHighlight: '#FFFFFF',
    textOnBase: '#BFBCB7',
    textOnSemiHighlight: '#BFBCB7',
    textOnHighlight: '#FFFFFF',
    border: '#F18701',
    shadow: 'rgba(0, 0, 0, 0.8)',
    overlay: 'rgba(255, 255, 255, 0.1)',
    accentColor: '#FF6B6B',
    switchTrackOn: '#F18701',
    switchTrackOff: '#3A3A3C',
    switchThumbOn: '#F35B04',
    switchThumbOff: '#FFFFFF',
  },

  // Define o tema "daltonic" (daltônico 1)

  daltonic: {
    name: 'Daltônico: vermelho/verde',
    backgroundBase: '#383428',
    backgroundSemiHighlight: '#3D7461',
    backgroundHighlight: '#F14B1B',
    input: '#83A279',
    inputError: '#FC9A9A',
    textHighlight: '#FFFFFF',
    textOnBase: '#FFFFFF',
    textOnSemiHighlight: '#83A279',
    textOnHighlight: '#000000',
    border: '#B0B0B0',
    shadow: 'rgba(0, 0, 0, 0.7)',
    overlay: 'rgba(255, 255, 255, 0.2)',
    accentColor: '#B0B0B0',
    switchTrackOn: '#F14B1B',
    switchTrackOff: '#3D7461',
    switchThumbOn: '#FFFFFF',
    switchThumbOff: '#F14B1B',
  },

  // Define o tema "daltonic_2" (daltônico 2)

  daltonic_2: {
    name: 'Daltônico: azul',
    backgroundBase: '#1B3C72',
    backgroundSemiHighlight: '#F5754E',
    backgroundHighlight: '#F6BC1D',
    input: '#B7CFE8',
    inputError: '#E28585',
    textHighlight: '#FFFFFF',
    textOnBase: '#FFFFFF',
    textOnSemiHighlight: '#1B3C72',
    textOnHighlight: '#000000',
    border: '#A49F8C',
    shadow: 'rgba(0, 0, 0, 0.4)',
    overlay: 'rgba(255, 255, 255, 0.25)',
    accentColor: '#F6BC1D',
    switchTrackOn: '#F6BC1D',
    switchTrackOff: '#1B3C72',
    switchThumbOn: '#FFFFFF',
    switchThumbOff: '#F5754E',
  },

  // Define o tema "daltonic_3" (daltônico 3)

  daltonic_3: {
    name: 'Daltônico: alto contraste',
    backgroundBase: '#2B3131',
    backgroundSemiHighlight: '#2857BF',
    backgroundHighlight: '#3EA74B',
    input: '#A6D8F0',
    inputError: '#FCB5B5',
    textHighlight: '#FFFFFF',
    textOnBase: '#FFFFFF',
    textOnSemiHighlight: '#F5AC07',
    textOnHighlight: '#000000',
    border: '#FBE3B5',
    shadow: 'rgba(0, 0, 0, 0.7)',
    overlay: 'rgba(255, 255, 255, 0.2)',
    accentColor: '#FBE3B5',
    switchTrackOn: '#3EA74B',
    switchTrackOff: '#2857BF',
    switchThumbOn: '#FFFFFF',
    switchThumbOff: '#3EA74B',
  },
};

// Exporta o objeto "theme" para ser usado em outras partes do código
export default theme;
