// hooks/useGameId.ts
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import Toast from 'react-native-toast-message';

export const useGameId = (): string | undefined => {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const router = useRouter();
  const [gameId, setGameId] = useState<string | undefined>();
  const [hasChecked, setHasChecked] = useState(false); // <- novo estado

  useEffect(() => {
    if (typeof id === 'string') {
      setGameId(id);
      setHasChecked(true);
    } else if (id === undefined) {
      // ainda carregando — não faz nada
    } else if (!hasChecked) {
      // só redireciona após pelo menos uma verificação
      Toast.show({
        type: 'error',
        text1: 'Erro ao carregar jogo',
        text2: 'ID do jogo não encontrado.',
      });
      router.replace('/boardgame');
      setHasChecked(true);
    }
  }, [id]);

  return gameId;
};
