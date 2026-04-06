import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemePreference = 'auto' | 'light' | 'dark';

const STORAGE_KEY = 'themePreference';

let themePreference: ThemePreference = 'auto';
const listeners = new Set<() => void>();

function emit() {
  for (const l of Array.from(listeners)) {
    try {
      l();
    } catch {}
  }
}

export function getThemePreference(): ThemePreference {
  return themePreference;
}

export function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export async function loadThemePreference() {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark' || stored === 'auto') {
      themePreference = stored;
      emit();
    }
  } catch {
    // ignore
  }
}

export async function setThemePreference(next: ThemePreference) {
  themePreference = next;
  emit();
  try {
    await AsyncStorage.setItem(STORAGE_KEY, next);
  } catch {
    // ignore persistence errors
  }
}
