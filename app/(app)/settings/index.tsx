// app/(app)/settings/index.tsx

import Header from '@components/Header';
import UniversalSlider from '@components/inputs/UniversalSlider';
import { useTheme } from '@hooks/useTheme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { useSettingsStore } from '@store/useSettingsStore';
import globalStyles from '@theme/global/globalStyles';
import theme from '@theme/global/theme';
import typography from '@theme/global/typography';
import { typedKeys } from '@utils/typedKeys';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';

export default function SettingsScreen() {
  const {
    fontOption,
    fontSizeMultiplier,
    theme: selectedTheme,
    setFont,
    setFontSizeMultiplier,
    setTheme,
    confirmChanges,
    restoreDefaults,
    isLoaded,
  } = useSettingsStore();

  const { colors, fontSizes, fontFamily } = useTheme();

  const [userId, setUserId] = useState<string | null>(null);
  const [localLoading, setLocalLoading] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem('userId').then((id) => setUserId(id));
  }, []);

  if (!isLoaded || !userId) {
    return (
      <View style={globalStyles.containerCentered}>
        <ActivityIndicator size="large" />
        <Text style={globalStyles.textCentered}>Carregando preferências...</Text>
      </View>
    );
  }

  const handleConfirm = async () => {
    try {
      setLocalLoading(true);
      await confirmChanges(userId);
      Toast.show({ type: 'success', text1: 'Preferências salvas com sucesso!' });
    } catch {
      Toast.show({ type: 'error', text1: 'Erro ao salvar preferências' });
    } finally {
      setLocalLoading(false);
    }
  };

  return (
    <View style={[globalStyles.container, { padding: 20, backgroundColor: colors.backgroundBase }]}>
      <Header title="Configurações" />
      <Text style={[globalStyles.textCenteredBold, { fontSize: fontSizes.large }]}>
        Configurações Visuais
      </Text>

      {/* Tema */}
      <Text style={[globalStyles.textJustifiedBoldItalic, localStyles.label]}>Tema</Text>
      <Picker selectedValue={selectedTheme} onValueChange={(itemValue) => setTheme(itemValue)}>
        {typedKeys(theme).map((key) => (
          <Picker.Item key={key} label={key} value={key} />
        ))}
      </Picker>

      {/* Fonte */}
      <Text style={[globalStyles.textJustifiedBoldItalic, localStyles.label]}>Fonte</Text>
      <Picker selectedValue={fontOption} onValueChange={(itemValue) => setFont(itemValue)}>
        {typedKeys(typography.fonts).map((key) => (
          <Picker.Item key={key} label={typography.fonts[key]} value={key} />
        ))}
      </Picker>

      {/* Tamanho base */}
      <Text style={[globalStyles.textJustifiedBoldItalic, localStyles.label]}>
        Tamanho da fonte
      </Text>
      <UniversalSlider
        value={fontSizeMultiplier}
        onChange={setFontSizeMultiplier}
        min={typography.sizes.min / typography.sizes.base}
        max={typography.sizes.max / typography.sizes.base}
        step={0.1}
        showValue
      />
      <Text style={globalStyles.textCentered}>
        Tamanho atual: {(fontSizeMultiplier * typography.sizes.base).toFixed(0)} px
      </Text>

      {/* Botões */}
      <TouchableOpacity style={globalStyles.button} onPress={handleConfirm} disabled={localLoading}>
        <Text style={globalStyles.textCenteredBold}>Salvar</Text>
      </TouchableOpacity>

      <TouchableOpacity style={globalStyles.button} onPress={restoreDefaults}>
        <Text style={globalStyles.textCentered}>Restaurar padrão</Text>
      </TouchableOpacity>

      <TouchableOpacity style={globalStyles.button} onPress={() => router.back()}>
        <Text style={globalStyles.textCentered}>Cancelar</Text>
      </TouchableOpacity>
    </View>
  );
}

const localStyles = StyleSheet.create({
  label: {
    marginTop: 20,
    marginBottom: 5,
  },
});
