export const routes = {
  public: {
    home: "/",
    login: "/login",
  },
  app: {
    dashboard: "/dashboard",
  },
} as const;

export type RoutePath = (typeof routes)[keyof typeof routes][keyof (typeof routes)[keyof typeof routes]];
