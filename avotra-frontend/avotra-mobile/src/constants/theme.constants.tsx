import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { lightColors, darkColors, ColorPalette } from "../styles/theme.colors";
import { createStyles, AppStyles } from "../styles/styles.global";

type ThemeMode = "light" | "dark" | "system";

interface ThemeContextType {
    mode: ThemeMode;
    isDark: boolean;
    colors: ColorPalette;
    styles: AppStyles;
    setMode: (mode: ThemeMode) => void;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
const STORAGE_KEY = "theme_preference";

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const systemScheme = useColorScheme();
    const [mode, setModeState] = useState<ThemeMode>("system");
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                const saved = await AsyncStorage.getItem(STORAGE_KEY);
                if (saved === "light" || saved === "dark" || saved === "system") {
                    setModeState(saved);
                }
            } finally {
                setLoaded(true);
            }
        })();
    }, []);

    const setMode = (newMode: ThemeMode) => {
        setModeState(newMode);
        AsyncStorage.setItem(STORAGE_KEY, newMode).catch(() => { });
    };

    const isDark = mode === "system" ? systemScheme === "dark" : mode === "dark";

    const toggleTheme = () => {
        setMode(isDark ? "light" : "dark");
    };

    const colors = isDark ? darkColors : lightColors;
    const styles = createStyles(colors);

    if (!loaded) return null;

    return (
        <ThemeContext.Provider value={{ mode, isDark, colors, styles, setMode, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme doit être utilisé à l'intérieur de ThemeProvider");
    }
    return context;
};