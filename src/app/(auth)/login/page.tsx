import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { routes } from "@/config/routes";
import { LoginPage } from "@/modules/auth/pages/LoginPage";
import {
  AUTH_TOKEN_COOKIE_NAME,
  getAuthNoticeMessage,
  getOAuthErrorMessage,
  getSingleSearchParamValue,
} from "@/modules/auth/utils";

interface LoginPageRouteProps {
  searchParams?: Promise<{
    error?: string | string[];
    notice?: string | string[];
  }>;
}

export default async function LoginPageRoute({ searchParams }: LoginPageRouteProps) {
  const authToken = (await cookies()).get(AUTH_TOKEN_COOKIE_NAME)?.value;

  if (authToken) {
    redirect(routes.app.dashboard);
  }

  const resolvedSearchParams = searchParams ? await searchParams : {};
  const oauthErrorMessage = getOAuthErrorMessage(getSingleSearchParamValue(resolvedSearchParams.error));
  const authNoticeMessage = getAuthNoticeMessage(
    getSingleSearchParamValue(resolvedSearchParams.notice),
  );

  return <LoginPage oauthErrorMessage={oauthErrorMessage} authNoticeMessage={authNoticeMessage} />;
}
