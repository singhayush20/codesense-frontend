"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  SYSTEM_THEME_MEDIA_QUERY,
  applyThemeToDocument,
  getInitialResolvedTheme,
  getInitialThemePreference,
  getSystemTheme,
  resolveThemePreference,
  type ResolvedTheme,
  type ThemePreference,
  writeStoredThemePreference,
} from "../utils";

interface ThemeContextValue {
  theme: ThemePreference;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: ThemePreference) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<ThemePreference>(getInitialThemePreference);
  const [systemTheme, setSystemTheme] = useState<ResolvedTheme>(getInitialResolvedTheme);
  const hasMountedRef = useRef(false);

  const setTheme = useCallback((nextTheme: ThemePreference) => {
    if (nextTheme === "system") {
      setSystemTheme(getSystemTheme());
    }

    setThemeState(nextTheme);
  }, []);

  const resolvedTheme = useMemo(
    () => resolveThemePreference(theme, systemTheme),
    [systemTheme, theme],
  );

  useEffect(() => {
    applyThemeToDocument({
      themePreference: theme,
      resolvedTheme,
      enableTransitions: hasMountedRef.current,
    });
    writeStoredThemePreference(theme);
    hasMountedRef.current = true;
  }, [resolvedTheme, theme]);

  useEffect(() => {
    const mediaQuery = window.matchMedia(SYSTEM_THEME_MEDIA_QUERY);
    const handleSystemThemeChange = (event: MediaQueryListEvent) => {
      setSystemTheme(event.matches ? "dark" : "light");
    };

    mediaQuery.addEventListener("change", handleSystemThemeChange);

    return () => {
      mediaQuery.removeEventListener("change", handleSystemThemeChange);
    };
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      resolvedTheme,
      setTheme,
    }),
    [resolvedTheme, setTheme, theme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useThemeContext(): ThemeContextValue {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider.");
  }

  return context;
}
