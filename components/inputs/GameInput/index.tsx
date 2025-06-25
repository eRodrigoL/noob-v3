// components/inputs/GameInput/index.tsx
import { globalStyles, useTheme } from '@theme/index';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

interface Props {
  value: string;
  onChangeText: (value: string) => void;
  onSelect: (gameName: string) => void;
  validGames: string[];
}

const GameInput: React.FC<Props> = ({ value, onChangeText, onSelect, validGames }) => {
  const { colors, fontSizes, fontFamily } = useTheme();
  const router = useRouter();
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const handleInput = (text: string) => {
    const query = text.trim().toLowerCase();
    onChangeText(text);

    if (query.length === 0) {
      setSuggestions([]);
      return;
    }

    const filtered = validGames.filter((name) => name.toLowerCase().includes(query)).slice(0, 6);
    setSuggestions(filtered);
  };

  const handleSelect = (gameName: string) => {
    onSelect(gameName);
    onChangeText(gameName);
    setSuggestions([]);
  };

  const gameExists = validGames.includes(value.trim());

  return (
    <View>
      <Text
        style={[
          globalStyles.textJustified,
          { color: colors.textOnBase, fontFamily, fontSize: fontSizes.base },
        ]}>
        Jogo:
      </Text>
      <TextInput
        placeholder="Digite o nome do jogo..."
        value={value}
        onChangeText={handleInput}
        style={[
          globalStyles.input,
          {
            color: colors.textOnBase,
            fontFamily,
            fontSize: fontSizes.base,
            borderWidth: 1,
            borderColor: colors.textOnBase,
          },
        ]}
      />

      {suggestions.length > 0 && (
        <View
          style={{
            backgroundColor: colors.backgroundSemiHighlight,
            borderColor: colors.border,
            borderWidth: 1,
            borderRadius: 4,
            marginTop: 4,
            paddingVertical: 4,
          }}>
          {suggestions.map((item, index) => (
            <TouchableOpacity key={index} onPress={() => handleSelect(item)}>
              <Text
                style={{
                  color: colors.textOnBase,
                  fontFamily,
                  fontSize: fontSizes.small,
                  paddingVertical: 4,
                  paddingHorizontal: 8,
                }}>
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <Text
        style={{
          marginTop: 6,
          fontSize: fontSizes.small,
          color: colors.textOnBase,
          fontFamily,
        }}>
        Jogo não listado? Clique{' '}
        <Text
          style={{ color: colors.textHighlight, textDecorationLine: 'underline' }}
          onPress={() => router.push('/boardgame/registerGame')}>
          aqui
        </Text>{' '}
        adicionar.
      </Text>
    </View>
  );
};

export default GameInput;
