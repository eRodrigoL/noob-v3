// app/_layout.tsx
import { useKeepApiAwake } from '@hooks/useKeepApiAwke';
import { Stack } from 'expo-router';
import Toast from 'react-native-toast-message';

export default function RootLayout() {
  // ✅ Correto: hook personalizado chamado diretamente no componente
  useKeepApiAwake();

  return (
    <>
      <Stack screenOptions={{ headerShown: false }} />
      <Toast />
    </>
  );
}
