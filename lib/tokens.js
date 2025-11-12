/**
 * 🎨 Design Tokens - Source de vérité unique pour XCannes DEX
 * Centralise toutes les couleurs, espacements, et styles
 */

export const colors = {
  // Backgrounds
  bg: {
    primary: "#0a0f0d", // Noir profond principal
    secondary: "#151a17", // Noir légèrement plus clair
    card: "#1a1f1d", // Fond des cartes
  },

  // Accents
  accent: {
    green: "#10b981", // Vert émeraude (couleur principale)
    greenDark: "#065f46", // Vert foncé
    blue: "#3b82f6", // Bleu primaire
    blueDark: "#1e40af", // Bleu foncé
    red: "#dc2626", // Rouge
    redLight: "#ef4444", // Rouge clair
    yellow: "#fbbf24", // Jaune
    yellowDark: "#92400e", // Jaune foncé
  },

  // Texte
  text: {
    primary: "#ffffff", // Blanc
    secondary: "#9ca3af", // Gris clair
    muted: "#6b7280", // Gris moyen
  },

  // Trading (pour les charts)
  trading: {
    up: "#10b981", // Bougie haussière
    down: "#dc2626", // Bougie baissière
    grid: "#2B2B43", // Grille du chart
    gridAlt: "#363C4E", // Grille alternative
  },
};

export const spacing = {
  xs: "0.25rem", // 4px
  sm: "0.5rem", // 8px
  md: "1rem", // 16px
  lg: "1.5rem", // 24px
  xl: "2rem", // 32px
  "2xl": "3rem", // 48px
};

export const borderRadius = {
  sm: "0.25rem", // 4px
  md: "0.5rem", // 8px
  lg: "0.75rem", // 12px
  xl: "1rem", // 16px
  full: "9999px", // Rounded
};

export const shadows = {
  sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
  md: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
  lg: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
  xl: "0 20px 25px -5px rgb(0 0 0 / 0.1)",
};

export default { colors, spacing, borderRadius, shadows };
