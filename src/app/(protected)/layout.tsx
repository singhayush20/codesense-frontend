import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { routes } from "@/config/routes";
import { ProtectedLayoutShell } from "@/modules/app-shell/components/ProtectedLayoutShell";
import { AUTH_TOKEN_COOKIE_NAME, isAuthenticatedValue } from "@/modules/auth/utils";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authToken = (await cookies()).get(AUTH_TOKEN_COOKIE_NAME)?.value;

  if (!isAuthenticatedValue(authToken)) {
    redirect(routes.public.login);
  }

  return <ProtectedLayoutShell>{children}</ProtectedLayoutShell>;
}
