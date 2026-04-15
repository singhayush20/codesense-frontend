export const AUTH_SESSION_EXPIRED_EVENT = "codesense:auth-session-expired";

interface AuthSessionExpiredEventDetail {
  message?: string;
}

export function dispatchAuthSessionExpired(message?: string) {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(
    new CustomEvent<AuthSessionExpiredEventDetail>(AUTH_SESSION_EXPIRED_EVENT, {
      detail: { message },
    }),
  );
}
