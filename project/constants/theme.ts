export const theme = {
  colors: {
    primary: '#C95E27', // Terracotta - main brand color
    secondary: '#2A9D8F', // Teal - secondary brand color
    accent: '#F4A261', // Sandy orange - accent color
    success: '#538D22', // Green - success color
    warning: '#FCBF49', // Amber - warning color
    error: '#E63946', // Red - error color
    background: '#FFFFFF',
    card: '#FFFFFF',
    text: '#2D3436',
    textSecondary: '#636E72',
    border: '#E2E8F0',
    
    // Additional colors for the African theme
    earth: '#8B4513', // Earthy brown
    savanna: '#DAA520', // Golden savanna
    forest: '#2E8B57', // Forest green
    sunset: '#FF7F50', // Sunset orange
    stone: '#A9A9A9', // Stone gray
    midnight: '#191970', // Midnight blue
  },
  
  spacing: {
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
    xxl: 48,
  },
  
  borderRadius: {
    small: 4,
    medium: 8,
    large: 16,
    round: 9999,
  },
  
  typography: {
    heading: {
      fontFamily: 'Ubuntu-Bold',
      h1: 32,
      h2: 28,
      h3: 24,
      h4: 20,
      h5: 18,
      h6: 16,
    },
    body: {
      fontFamily: 'Montserrat-Regular',
      regular: 14,
      small: 12,
      large: 16,
    },
  },
  
  shadows: {
    small: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 4,
    },
    large: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 8,
    },
  },
};