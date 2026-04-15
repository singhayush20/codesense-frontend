export interface LoginCredentials {
  email: string;
  password: string;
}

export interface OAuthProvider {
  name: "GitHub" | "Google";
  url: string;
}

export interface AuthTokenResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  accessTokenExpiresAt: string;
  refreshTokenExpiresAt: string;
}

export type AuthNoticeCode = "session_expired";
