import { StyleSheet } from 'react-native';

export const cardSurfaceBaseStyle = {
  borderRadius: 16,
  padding: 24,
  gap: 18,
  borderWidth: StyleSheet.hairlineWidth,
} as const;

type SupportedScheme = 'light' | 'dark';

const CARD_SURFACE_COLORS: Record<SupportedScheme, { background: string; border: string }> = {
  light: {
    background: '#FFFFFF',
    border: '#E5E5EA',
  },
  dark: {
    background: '#1C1C1E',
    border: '#3A3A3C',
  },
};

export const getCardSurfaceColors = (scheme?: SupportedScheme | null) => {
  if (scheme === 'dark') {
    return CARD_SURFACE_COLORS.dark;
  }

  return CARD_SURFACE_COLORS.light;
};
