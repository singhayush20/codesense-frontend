import { useAuthContext } from "@/modules/auth/providers/AuthProvider";

export function useAuth() {
  return useAuthContext();
}
