// lib/getImageSource.ts
import { ImageSourcePropType } from 'react-native';

/**
 * Garante que a imagem seja compatível com o tipo esperado pelo componente <Image />
 * @param uri string | null - caminho da imagem remota
 * @param fallback número - imagem local importada com require()
 * @returns ImageSourcePropType
 */
export function getImageSource(uri: string | null, fallback: number): ImageSourcePropType {
  if (uri && uri.trim() !== '') {
    return { uri };
  }
  return fallback;
}
