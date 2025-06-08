// theme/global/typography.ts

// Define os estilos de tipografia globais da aplicação
const typography = {
  // Famílias de fontes disponíveis no app (devem corresponder ao nome no useFonts)
  fonts: {
    arial: 'Arial',
    helvetica: 'Helvetica',
    roboto: 'Roboto',
    serif: 'Serif',
    times: 'Times New Roman',
  },

  // Tamanhos base de fonte e multiplicadores
  sizes: {
    base: 16, // Tamanho padrão do corpo do texto (em pixels)

    // Multiplicadores proporcionais
    smallMultiplier: 0.85, // Pequeno (15% menor que o padrão)
    largeMultiplier: 1.3, // Grande (30% maior que o padrão)
    giantMultiplier: 1.6, // Gigante (60% maior que o padrão)

    // Limites globais
    min: 12, // Tamanho mínimo permitido (em pixels)
    max: 24, // Tamanho máximo permitido (em pixels)
  },
};

export default typography;
