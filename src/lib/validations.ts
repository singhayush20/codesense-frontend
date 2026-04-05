import { z } from 'zod';

// Validation schemas

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});
