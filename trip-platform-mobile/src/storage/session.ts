import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const ACCESS_TOKEN_KEY = "trip_platform_access_token";
const REFRESH_TOKEN_KEY = "trip_platform_refresh_token";

export type SessionTokens = {
  accessToken: string;
  refreshToken: string;
};

const isWeb = Platform.OS === "web";

export async function saveSession(tokens: SessionTokens) {
  if (isWeb) {
    localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
  } else {
    await Promise.all([
      SecureStore.setItemAsync(ACCESS_TOKEN_KEY, tokens.accessToken),
      SecureStore.setItemAsync(REFRESH_TOKEN_KEY, tokens.refreshToken),
    ]);
  }
}

export async function getSession() {
  let accessToken: string | null;
  let refreshToken: string | null;

  if (isWeb) {
    accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
    refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
  } else {
    [accessToken, refreshToken] = await Promise.all([
      SecureStore.getItemAsync(ACCESS_TOKEN_KEY),
      SecureStore.getItemAsync(REFRESH_TOKEN_KEY),
    ]);
  }

  if (!accessToken || !refreshToken) {
    return null;
  }

  return { accessToken, refreshToken };
}

export async function clearSession() {
  if (isWeb) {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  } else {
    await Promise.all([
      SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY),
      SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY),
    ]);
  }
}
