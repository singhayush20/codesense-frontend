// Global TypeScript types

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
}
