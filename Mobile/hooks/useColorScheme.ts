import { useEffect } from 'react';
import { useColorScheme as rnUseColorScheme } from 'react-native';
import { useSyncExternalStore } from 'react';
import {
	getThemePreference,
	loadThemePreference,
	setThemePreference as setPref,
	subscribe,
	type ThemePreference,
} from '@/lib/themePreference';

/**
 * Returns the resolved color scheme for the app:
 * - 'light' or 'dark' if the user explicitly chose a theme
 * - system scheme when preference is 'auto'
 */
export function useColorScheme(): 'light' | 'dark' | null | undefined {
	const systemScheme = rnUseColorScheme();
	const pref = useSyncExternalStore(subscribe, getThemePreference, getThemePreference);

	useEffect(() => {
		// Load persisted theme preference on first mount
		loadThemePreference();
	}, []);

	if (pref === 'auto') {
		return systemScheme;
	}
	return pref;
}

export function useThemePreference(): ThemePreference {
	return useSyncExternalStore(subscribe, getThemePreference, getThemePreference);
}

export async function setThemePreference(next: ThemePreference) {
	await setPref(next);
}
