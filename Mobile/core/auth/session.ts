import AsyncStorage from '@react-native-async-storage/async-storage';

import type { AuthListener, MobileAuthUser, MobileSession } from '@/core/auth/types';

const TOKEN_STORAGE_KEY = 'off2zim_mobile_token';
const USER_STORAGE_KEY = 'off2zim_mobile_user';

const listeners = new Set<AuthListener>();

let memoryToken: string | null = null;
let memoryUser: MobileAuthUser | null = null;

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

