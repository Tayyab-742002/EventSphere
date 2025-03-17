import "react-native-url-polyfill/auto";
import { createClient } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import * as aesjs from "aes-js";
import "react-native-get-random-values";
// As Expo's SecureStore does not support values larger than 2048
// bytes, an AES-256 key is generated and stored in SecureStore, while
// it is used to encrypt/decrypt values stored in AsyncStorage.
class LargeSecureStore {
  private async logStorageMetrics(key: string, value: string, encrypted: string) {
    if (__DEV__) {
      const valueSize = new Blob([value]).size;
      const encryptedSize = new Blob([encrypted]).size;
      const encryptionKeySize = 32; // 256 bits = 32 bytes

      console.log(
        `Storage Metrics for key "${key}":`,
        `\n- Original Value Size: ${valueSize} bytes`,
        `\n- Encrypted Value Size (AsyncStorage): ${encryptedSize} bytes`,
        `\n- Encryption Key Size (SecureStore): ${encryptionKeySize} bytes`,
        `\n- SecureStore Limit: 2048 bytes`,
        `\n- Is SecureStore Safe: ${encryptionKeySize <= 2048 ? "✅" : "❌"}`,
        `\n- Encryption Overhead: ${Math.round((encryptedSize / valueSize - 1) * 100)}%`
      );

      if (encryptionKeySize > 2048) {
        console.warn("⚠️ Warning: SecureStore size exceeds 2048 bytes limit!");
      }
    }
  }

  private async _encrypt(key: string, value: string) {
    const encryptionKey = crypto.getRandomValues(new Uint8Array(256 / 8));

    const cipher = new aesjs.ModeOfOperation.ctr(
      encryptionKey,
      new aesjs.Counter(1)
    );
    const encryptedBytes = cipher.encrypt(aesjs.utils.utf8.toBytes(value));
    const encrypted = aesjs.utils.hex.fromBytes(encryptedBytes);

    await SecureStore.setItemAsync(
      key,
      aesjs.utils.hex.fromBytes(encryptionKey)
    );

    // Log metrics after encryption
    await this.logStorageMetrics(key, value, encrypted);

    return encrypted;
  }

  private async _decrypt(key: string, value: string) {
    const encryptionKeyHex = await SecureStore.getItemAsync(key);
    if (!encryptionKeyHex) {
      return encryptionKeyHex;
    }

    const cipher = new aesjs.ModeOfOperation.ctr(
      aesjs.utils.hex.toBytes(encryptionKeyHex),
      new aesjs.Counter(1)
    );
    const decryptedBytes = cipher.decrypt(aesjs.utils.hex.toBytes(value));
    const decrypted = aesjs.utils.utf8.fromBytes(decryptedBytes);

    // Log metrics after decryption
    await this.logStorageMetrics(key, decrypted, value);

    return decrypted;
  }

  async getItem(key: string) {
    const encrypted = await AsyncStorage.getItem(key);
    if (!encrypted) {
      return encrypted;
    }

    return await this._decrypt(key, encrypted);
  }

  async removeItem(key: string) {
    await AsyncStorage.removeItem(key);
    await SecureStore.deleteItemAsync(key);

    if (__DEV__) {
      console.log(`Storage items removed for key "${key}"`);
    }
  }

  async setItem(key: string, value: string) {
    const encrypted = await this._encrypt(key, value);
    await AsyncStorage.setItem(key, encrypted);
  }
}

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: new LargeSecureStore(),
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
