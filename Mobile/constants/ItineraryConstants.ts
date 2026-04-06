// Theme colors for the itinerary screen
export const ITINERARY_COLORS = {
  light: {
    background: '#f2f2f7',
    surface: '#ffffff',
    primary: '#007AFF',
    destructive: '#FF3B30',
    text: '#000000',
    textSecondary: 'rgba(0, 0, 0, 0.6)',
  },
  dark: {
    background: '#000000',
    surface: '#1c1c1e',
    primary: '#0A84FF',
    destructive: '#FF453A',
    text: '#ffffff',
    textSecondary: 'rgba(255, 255, 255, 0.6)',
  },
} as const;

// Animation durations
export const ITINERARY_ANIMATIONS = {
  CARD_ANIMATION: 260,
  MONTH_TRANSITION_FAST: 200,
} as const;

// Refresh simulation delay
export const REFRESH_DELAY = 1000;

// Date format utility
export const getCurrentDateString = (): string => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
};
