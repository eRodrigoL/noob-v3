// app/(app)/settings/index.tsx

import {
  ButtonHighlight,
  ButtonSemiHighlight,
  HeaderLayout,
  UniversalSlider,
} from '@components/index';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { useSettingsStore } from '@store/useSettingsStore';
import { globalStyles, theme, typography, useTheme } from '@theme/index';
import { typedKeys } from '@utils/typedKeys';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import Toast from 'react-native-toast-message';

function SettingsScreen() {
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
    <View style={[globalStyles.container, { backgroundColor: colors.backgroundBase }]}>
      <HeaderLayout title="Configurações">
        <View style={[globalStyles.container, { padding: 20 }]}>
          <Text
            style={[
              globalStyles.textCenteredBold,
              { color: colors.textOnBase, fontFamily: fontFamily, fontSize: fontSizes.large },
            ]}>
            Configurações Visuais
          </Text>

          {/* Tema */}
          <Text
            style={[
              globalStyles.textJustifiedBoldItalic,
              { color: colors.textOnBase, fontFamily: fontFamily, fontSize: fontSizes.base },
            ]}>
            Tema
          </Text>
          <Picker
            accessibilityLabel="Selecionar tema do aplicativo"
            style={{
              color: colors.textOnBase,
              fontFamily: fontFamily,
              fontSize: fontSizes.base,
            }}
            selectedValue={selectedTheme}
            onValueChange={(itemValue) => setTheme(itemValue)}>
            {typedKeys(theme).map((key) => (
              <Picker.Item key={key} label={key} value={key} />
            ))}
          </Picker>

          {/* Fonte */}
          <Text
            style={[
              globalStyles.textJustifiedBoldItalic,
              { color: colors.textOnBase, fontFamily: fontFamily, fontSize: fontSizes.base },
            ]}>
            Fonte
          </Text>
          <Picker
            style={{
              color: colors.textOnBase,
              fontFamily: fontFamily,
              fontSize: fontSizes.base,
            }}
            selectedValue={fontOption}
            onValueChange={(itemValue) => setFont(itemValue)}>
            {typedKeys(typography.fonts).map((key) => (
              <Picker.Item key={key} label={typography.fonts[key]} value={key} />
            ))}
          </Picker>

          {/* Tamanho base */}
          <Text
            style={[
              globalStyles.textJustifiedBoldItalic,
              { color: colors.textOnBase, fontFamily: fontFamily, fontSize: fontSizes.base },
            ]}>
            Tamanho da fonte
          </Text>
          <UniversalSlider
            accessibilityLabel="Ajustar tamanho da fonte"
            accessibilityHint="Deslize para alterar o tamanho do texto exibido no app"
            value={fontSizeMultiplier}
            onChange={setFontSizeMultiplier}
            min={typography.sizes.min / typography.sizes.base}
            max={typography.sizes.max / typography.sizes.base}
            step={0.1}
            showValue
          />
          <Text
            style={[
              globalStyles.textCentered,
              { color: colors.textOnBase, fontFamily: fontFamily, fontSize: fontSizes.small },
            ]}>
            Tamanho atual: {(fontSizeMultiplier * typography.sizes.base).toFixed(0)} px
          </Text>

          {/* Botões */}

          <ButtonHighlight
            title="Salvar"
            onPress={handleConfirm}
            disabled={localLoading}
            accessibilityLabel="Salvar preferências visuais"
            accessibilityHint="Confirma e aplica as configurações de tema, fonte e tamanho selecionadas"
          />
          
          <ButtonSemiHighlight
            title="Restaurar padrão"
            onPress={restoreDefaults}
            accessibilityLabel="Restaurar configurações para o padrão"
            accessibilityHint="Restaura o tema, fonte e tamanho da fonte para os valores originais"
          />

          <ButtonSemiHighlight
            title="Cancelar"
            onPress={() => router.back()}
            accessibilityLabel="Cancelar alterações"
            accessibilityHint="Descarta as alterações feitas e retorna para a tela anterior"
          /><ButtonSemiHighlight title="Cancelar" onPress={() => router.back()} />
        </View>
      </HeaderLayout>
    </View>
  );
}

export default SettingsScreen;
