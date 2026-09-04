export const lightColors = {
    primary: "#1E7145",
    primarySoft: "#E3F1E7",
    primaryDark: "#124A2C",

    accent: "#155DBD",
    accentSoft: "#E1EBFB",
    highlight: "#CFE0F7",

    background: "#F3F6F4",
    surface: "#FFFFFF",
    surfaceAlt: "#EAF1EC",
    surfaceSunken: "#E7EDE9",

    text: "#26282B",
    textSecondary: "#666F6A",
    textLight: "#93998F",

    border: "#DFE6E1",

    success: "#2F9E5B",
    danger: "#B3261E",
    dangerSoft: "#F7DEDB",
    warning: "#D9A441",

    black: "#26282B",
    white: "#FFFFFF",
    muted: "#F2F5F2",
};

export const darkColors: typeof lightColors = {
    primary: "#34A66C",
    primarySoft: "#163526",
    primaryDark: "#0D2A1B",

    accent: "#4C8DFF",
    accentSoft: "#1B2A44",
    highlight: "#26375A",

    background: "#12151A",
    surface: "#1B1F24",
    surfaceAlt: "#202722",
    surfaceSunken: "#171B1E",

    text: "#EDEFEC",
    textSecondary: "#A7AFA9",
    textLight: "#6E766F",

    border: "#2B3129",

    success: "#3FBE7A",
    danger: "#E5564C",
    dangerSoft: "#3A1E1C",
    warning: "#E3B15A",

    black: "#EDEFEC",
    white: "#FFFFFF",
    muted: "#20242A",
};

export type ColorPalette = typeof lightColors;