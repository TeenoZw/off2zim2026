export const theme = {
  colors: {
    primary: "#C95E27", // Terracotta - main brand color
    secondary: "#2A9D8F", // Teal - secondary brand color
    accent: "#F4A261", // Sandy orange - accent color
    success: "#538D22", // Green - success color
    warning: "#FCBF49", // Amber - warning color
    error: "#E63946", // Red - error color
    background: "#FFFFFF",
    card: "#FFFFFF",
    text: "#2D3436",
    textSecondary: "#636E72",
    border: "#E2E8F0",

    // Additional colors for the African theme
    earth: "#8B4513", // Earthy brown
    savanna: "#DAA520", // Golden savanna
    forest: "#2E8B57", // Forest green
    sunset: "#FF7F50", // Sunset orange
    stone: "#A9A9A9", // Stone gray
    midnight: "#191970", // Midnight blue
  },

  spacing: {
    xs: "4px",
    s: "8px",
    m: "16px",
    l: "24px",
    xl: "32px",
    xxl: "48px",
  },

  borderRadius: {
    small: "4px",
    medium: "8px",
    large: "16px",
    round: "9999px",
  },

  typography: {
    heading: {
      fontFamily: "var(--font-heading)",
      h1: "32px",
      h2: "28px",
      h3: "24px",
      h4: "20px",
      h5: "18px",
      h6: "16px",
    },
    body: {
      fontFamily: "var(--font-body)",
      large: "18px",
      medium: "16px",
      small: "14px",
      tiny: "12px",
    },
  },

  shadows: {
    small: "0 1px 3px rgba(0, 0, 0, 0.1)",
    medium: "0 4px 6px rgba(0, 0, 0, 0.1)",
    large: "0 10px 15px rgba(0, 0, 0, 0.1)",
    xl: "0 20px 25px rgba(0, 0, 0, 0.1)",
  },

  breakpoints: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
  },
} as const;

export type Theme = typeof theme;
