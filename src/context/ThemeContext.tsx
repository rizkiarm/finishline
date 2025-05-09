import { createContext } from "preact";
import { useEffect, useContext } from "preact/hooks";
import { useStorage } from "../hooks/useStorage";
import { setDaisyTheme } from "../utils/theme";
import type { Theme } from "../types";
import type { ComponentChildren } from "preact";

interface ThemeContextValue {
    theme: Theme;
    // eslint-disable-next-line no-unused-vars
    setTheme: (t: Theme) => void;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: ComponentChildren }) {
    // Use useLocalStorage for theme with default 'light'
    const [theme, setTheme] = useStorage<Theme>("theme", "light");

    useEffect(() => {
        setDaisyTheme(theme);
    }, [theme]);

    const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

    return (
        <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const ctx = useContext(ThemeContext);
    if (!ctx) throw new Error("useTheme must be used within a ThemeProvider");
    return ctx;
}
