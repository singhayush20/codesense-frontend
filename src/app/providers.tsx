"use client";

import { AuthProvider } from "@/modules/auth/providers/AuthProvider";

interface ProvidersProps {
  children: React.ReactNode;
  initialIsAuthenticated: boolean;
}

export function Providers({ children, initialIsAuthenticated }: ProvidersProps) {
  return (
    <AuthProvider initialIsAuthenticated={initialIsAuthenticated}>
      {children}
    </AuthProvider>
  );
}
