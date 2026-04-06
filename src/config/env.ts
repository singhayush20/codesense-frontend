function getRequiredEnv(name: keyof NodeJS.ProcessEnv): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function getRequiredUrlEnv(name: keyof NodeJS.ProcessEnv): string {
  const value = getRequiredEnv(name);

  try {
    return new URL(value).toString();
  } catch {
    throw new Error(`Environment variable ${name} must be a valid absolute URL.`);
  }
}

export interface AuthEnv {
  apiUrl: string;
  appUrl: string;
  googleClientId: string;
}

export function getAuthEnv(): AuthEnv {
  return {
    apiUrl: getRequiredUrlEnv("API_URL"),
    appUrl: getRequiredUrlEnv("NEXT_PUBLIC_APP_URL"),
    googleClientId: getRequiredEnv("NEXT_PUBLIC_GOOGLE_CLIENT_ID"),
  };
}
