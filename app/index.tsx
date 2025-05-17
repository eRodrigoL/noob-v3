// app/index.tsx
import { Splash } from '@components/index'; // Componente de carregamento global
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';

/**
 * Tela inicial do app que redireciona automaticamente para a rota principal.
 */
export default function Index() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/(legacy)/boardgameOld');
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [router]);

  return loading ? <Splash /> : null;
}
