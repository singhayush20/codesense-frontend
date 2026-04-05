import { useState } from 'react';
import type { User } from '@/types';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (credentials: { email: string; password: string }) => {
    setIsLoading(true);
    // Mock login
    setTimeout(() => {
      setUser({ id: '1', email: credentials.email, name: 'User' });
      setIsLoading(false);
    }, 1000);
  };

  return { user, isLoading, login };
}
