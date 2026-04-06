export const THEME_STORAGE_KEY = "codesense.theme";
export const THEME_TRANSITION_CLASS_NAME = "theme-changing";
export const THEME_PREFERENCE_ATTRIBUTE = "data-theme-preference";
export const THEME_DARK_CLASS_NAME = "dark";
export const SYSTEM_THEME_MEDIA_QUERY = "(prefers-color-scheme: dark)";

export type ThemePreference = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

let themeTransitionTimeoutId: number | undefined;

export function isThemePreference(value: string | null | undefined): value is ThemePreference {
  return value === "light" || value === "dark" || value === "system";
}

export function getSystemTheme(): ResolvedTheme {
  if (typeof window === "undefined") {
    return "light";
  }

  return window.matchMedia(SYSTEM_THEME_MEDIA_QUERY).matches ? "dark" : "light";
}

export function resolveThemePreference(
  themePreference: ThemePreference,
  systemTheme: ResolvedTheme,
): ResolvedTheme {
  return themePreference === "system" ? systemTheme : themePreference;
}

export function readStoredThemePreference(): ThemePreference | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const storedPreference = window.localStorage.getItem(THEME_STORAGE_KEY);
    return isThemePreference(storedPreference) ? storedPreference : null;
  } catch {
    return null;
  }
}

export function getInitialThemePreference(): ThemePreference {
  if (typeof document !== "undefined") {
    const documentPreference = document.documentElement.getAttribute(THEME_PREFERENCE_ATTRIBUTE);

    if (isThemePreference(documentPreference)) {
      return documentPreference;
    }
  }

  return readStoredThemePreference() ?? "system";
}

export function getInitialResolvedTheme(): ResolvedTheme {
  if (typeof document === "undefined") {
    return "light";
  }

  return document.documentElement.classList.contains(THEME_DARK_CLASS_NAME) ? "dark" : "light";
}

export function applyThemeToDocument({
  themePreference,
  resolvedTheme,
  enableTransitions = false,
}: {
  themePreference: ThemePreference;
  resolvedTheme: ResolvedTheme;
  enableTransitions?: boolean;
}): void {
  if (typeof document === "undefined") {
    return;
  }

  const root = document.documentElement;

  if (enableTransitions && typeof window !== "undefined") {
    root.classList.add(THEME_TRANSITION_CLASS_NAME);
    window.clearTimeout(themeTransitionTimeoutId);
    themeTransitionTimeoutId = window.setTimeout(() => {
      root.classList.remove(THEME_TRANSITION_CLASS_NAME);
    }, 220);
  }

  root.setAttribute(THEME_PREFERENCE_ATTRIBUTE, themePreference);
  root.classList.toggle(THEME_DARK_CLASS_NAME, resolvedTheme === "dark");
  root.style.colorScheme = resolvedTheme;
}

export function writeStoredThemePreference(themePreference: ThemePreference): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, themePreference);
  } catch {
    // Ignore storage write failures and keep the in-memory preference.
  }
}

export function getThemeInitializationScript(): string {
  return `
    (function () {
      var storageKey = ${JSON.stringify(THEME_STORAGE_KEY)};
      var preferenceAttribute = ${JSON.stringify(THEME_PREFERENCE_ATTRIBUTE)};
      var darkClassName = ${JSON.stringify(THEME_DARK_CLASS_NAME)};
      var mediaQuery = ${JSON.stringify(SYSTEM_THEME_MEDIA_QUERY)};
      var root = document.documentElement;

      try {
        var storedPreference = window.localStorage.getItem(storageKey);
        var themePreference =
          storedPreference === "light" || storedPreference === "dark" || storedPreference === "system"
            ? storedPreference
            : "system";
        var resolvedTheme =
          themePreference === "dark" ||
          (themePreference === "system" && window.matchMedia(mediaQuery).matches)
            ? "dark"
            : "light";

        root.setAttribute(preferenceAttribute, themePreference);
        root.classList.toggle(darkClassName, resolvedTheme === "dark");
        root.style.colorScheme = resolvedTheme;
      } catch (error) {
        var fallbackResolvedTheme = window.matchMedia(mediaQuery).matches ? "dark" : "light";
        root.setAttribute(preferenceAttribute, "system");
        root.classList.toggle(darkClassName, fallbackResolvedTheme === "dark");
        root.style.colorScheme = fallbackResolvedTheme;
      }
    })();
  `;
}
