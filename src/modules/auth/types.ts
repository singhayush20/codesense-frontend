// Auth module types

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface OAuthProvider {
  name: 'GitHub' | 'Google';
  url: string;
}
