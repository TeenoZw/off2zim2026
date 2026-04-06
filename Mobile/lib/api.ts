import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

const TOKEN_STORAGE_KEY = 'off2zim_mobile_token';
const USER_STORAGE_KEY = 'off2zim_mobile_user';

export type MobileAuthUser = {
  id: string;
  email: string;
  user_metadata: Record<string, any>;
};

export type MobileSession = {
  access_token: string;
  user: MobileAuthUser;
};

type AuthListener = (event: 'SIGNED_IN' | 'SIGNED_OUT' | 'USER_UPDATED', session: MobileSession | null) => void;

const listeners = new Set<AuthListener>();

let memoryToken: string | null = null;
let memoryUser: MobileAuthUser | null = null;

function getConfiguredBaseUrl() {
  const envBase = process.env.EXPO_PUBLIC_API_BASE_URL?.trim();
  if (envBase) {
    return envBase.replace(/\/+$/, '');
  }

  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    return window.location.origin.replace(/\/+$/, '');
  }

  const hostUri =
    Constants.expoConfig?.hostUri ||
    (Constants as any).manifest2?.extra?.expoClient?.hostUri ||
    (Constants as any).manifest?.debuggerHost;

  if (hostUri) {
    const host = hostUri.split(':')[0];
    return `http://${host}:3000`;
  }

  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:3000';
  }

  return 'http://127.0.0.1:3000';
}

const API_BASE_URL = getConfiguredBaseUrl();

export function getApiBaseUrl() {
  return API_BASE_URL;
}

export async function getStoredToken() {
  if (memoryToken) {
    return memoryToken;
  }

  memoryToken = await AsyncStorage.getItem(TOKEN_STORAGE_KEY);
  return memoryToken;
}

export async function getStoredUser() {
  if (memoryUser) {
    return memoryUser;
  }

  const serialized = await AsyncStorage.getItem(USER_STORAGE_KEY);
  if (!serialized) {
    return null;
  }

  try {
    memoryUser = JSON.parse(serialized) as MobileAuthUser;
    return memoryUser;
  } catch {
    return null;
  }
}

export async function persistSession(token: string, user: MobileAuthUser) {
  memoryToken = token;
  memoryUser = user;
  await AsyncStorage.multiSet([
    [TOKEN_STORAGE_KEY, token],
    [USER_STORAGE_KEY, JSON.stringify(user)],
  ]);
  notifyAuthListeners('SIGNED_IN', { access_token: token, user });
}

export async function persistUser(user: MobileAuthUser) {
  memoryUser = user;
  await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  const token = await getStoredToken();
  notifyAuthListeners('USER_UPDATED', token ? { access_token: token, user } : null);
}

export async function clearSession() {
  memoryToken = null;
  memoryUser = null;
  await AsyncStorage.multiRemove([TOKEN_STORAGE_KEY, USER_STORAGE_KEY]);
  notifyAuthListeners('SIGNED_OUT', null);
}

export function subscribeToAuth(listener: AuthListener) {
  listeners.add(listener);
  return {
    unsubscribe: () => {
      listeners.delete(listener);
    },
  };
}

function notifyAuthListeners(
  event: 'SIGNED_IN' | 'SIGNED_OUT' | 'USER_UPDATED',
  session: MobileSession | null
) {
  listeners.forEach(listener => {
    try {
      listener(event, session);
    } catch (error) {
      console.error('Auth listener error:', error);
    }
  });
}

export async function buildSession() {
  const [token, user] = await Promise.all([getStoredToken(), getStoredUser()]);
  if (!token || !user) {
    return null;
  }

  return {
    access_token: token,
    user,
  } satisfies MobileSession;
}

export async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = await getStoredToken();
  const headers = new Headers(init.headers);
  const isFormData =
    typeof FormData !== 'undefined' && init.body instanceof FormData;

  if (init.body && !isFormData && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers,
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message =
      typeof payload?.error === 'string' ? payload.error : 'Request failed';
    throw new Error(message);
  }

  return payload as T;
}
