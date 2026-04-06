"use client";

import { AuthProvider } from "@/modules/auth/providers/AuthProvider";
import { ThemeProvider } from "@/modules/theme/providers/ThemeProvider";

interface ProvidersProps {
  children: React.ReactNode;
  initialIsAuthenticated: boolean;
}

export function Providers({ children, initialIsAuthenticated }: ProvidersProps) {
  return (
    <ThemeProvider>
      <AuthProvider initialIsAuthenticated={initialIsAuthenticated}>
        {children}
      </AuthProvider>
    </ThemeProvider>
  );
}
