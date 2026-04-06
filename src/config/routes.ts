export const routes = {
  public: {
    home: "/",
    login: "/login",
  },
  auth: {
    googleStart: "/auth/google/start",
    googleCallback: "/auth/google/callback",
    logout: "/auth/logout",
  },
  app: {
    dashboard: "/dashboard",
    profile: "/profile",
  },
} as const;

export type RoutePath = (typeof routes)[keyof typeof routes][keyof (typeof routes)[keyof typeof routes]];
