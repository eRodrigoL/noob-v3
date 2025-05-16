// hooks/useKeepApiAwke.ts
import { warmUpApi } from '@hooks/useWarmUpApi';
import { useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';

/**
 * Mantém a API acordada enquanto o app estiver aberto.
 * - Ao iniciar
 * - Ao retornar do segundo plano
 * - Em intervalos regulares
 */
export function useKeepApiAwake() {
  const appState = useRef<AppStateStatus>(AppState.currentState);

  useEffect(() => {
    warmUpApi();

    const appStateListener = AppState.addEventListener('change', (nextState) => {
      const isReturningFromBackground =
        appState.current.match(/inactive|background/) && nextState === 'active';

      if (isReturningFromBackground) {
        warmUpApi();
      }

      appState.current = nextState;
    });

    const intervalId = setInterval(() => {
      if (appState.current === 'active') {
        warmUpApi();
      }
    }, 240_000);

    return () => {
      appStateListener.remove();
      clearInterval(intervalId);
    };
  }, []);
}
