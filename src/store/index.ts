// Global state store (simple implementation)

interface AppState {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

let theme: 'light' | 'dark' = 'dark';

export const store: AppState = {
  get theme() {
    return theme;
  },
  setTheme: (newTheme) => {
    theme = newTheme;
  },
};
