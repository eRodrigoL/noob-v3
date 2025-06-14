// storage.ts

import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { encrypt, decrypt } from '../utils/cryptoUtils'; // ajuste o caminho conforme sua estrutura

const isWeb = Platform.OS === 'web';

export const storage = {
  async getItem(key: string): Promise<string | null> {
    if (isWeb) {
      const encrypted = await AsyncStorage.getItem(key);
      return encrypted ? decrypt(encrypted) : null;
    } else {
      return await SecureStore.getItemAsync(key);
    }
  },

  async setItem(key: string, value: string): Promise<void> {
    if (isWeb) {
      const encrypted = encrypt(value);
      await AsyncStorage.setItem(key, encrypted);
    } else {
      await SecureStore.setItemAsync(key, value);
    }
  },

  async removeItem(key: string): Promise<void> {
    if (isWeb) {
      await AsyncStorage.removeItem(key);
    } else {
      await SecureStore.deleteItemAsync(key);
    }
  },

  async multiGet(keys: string[]): Promise<[string, string | null][]> {
    if (isWeb) {
      const readonlyResult = await AsyncStorage.multiGet(keys);
      return readonlyResult.map(([key, value]) => [
        key,
        value ? decrypt(value) : null,
      ]);
    } else {
      return await Promise.all(
        keys.map(async (key) => [key, await SecureStore.getItemAsync(key)] as [string, string | null])
      );
    }
  },

  async multiSet(pairs: [string, string][]): Promise<void> {
    if (isWeb) {
      const encryptedPairs = pairs.map(([key, value]) => [key, encrypt(value)] as [string, string]);
      await AsyncStorage.multiSet(encryptedPairs);
    } else {
      await Promise.all(pairs.map(([key, value]) => SecureStore.setItemAsync(key, value)));
    }
  },

  async clear(keys: string[]): Promise<void> {
    if (isWeb) {
      await Promise.all(keys.map((key) => AsyncStorage.removeItem(key)));
    } else {
      await Promise.all(keys.map((key) => SecureStore.deleteItemAsync(key)));
    }
  },
};


