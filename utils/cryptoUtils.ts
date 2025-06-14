import CryptoJS from 'crypto-js';
import Constants from 'expo-constants';

const secret = Constants.expoConfig?.extra?.APP_SECRET;

if (!secret) {
  throw new Error('APP_SECRET não definida no ambiente!');
}

export function encrypt(value: string): string {
  return CryptoJS.AES.encrypt(value, secret).toString();
}

export function decrypt(value: string): string {
  const bytes = CryptoJS.AES.decrypt(value, secret);
  return bytes.toString(CryptoJS.enc.Utf8);
}

