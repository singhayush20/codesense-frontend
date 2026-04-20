export interface LoginCredentials {
  email: string;
  password: string;
}

export interface OAuthProvider {
  name: "GitHub" | "Google";
  url: string;
}

export type AuthNoticeCode = "session_expired";
