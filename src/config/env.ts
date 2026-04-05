import { z } from 'zod';

const envSchema = z.object({
  NEXT_PUBLIC_API_URL: z.url(),
  // Add other env vars
});

export const env = envSchema.parse(process.env);
