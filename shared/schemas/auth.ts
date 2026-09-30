import { z } from 'zod';

export const LoginResponseSchema = z.object({
  accessToken: z.string(),
});

export const LoginErrorSchema = z.object({
  error: z.string(),
  message: z.string(),
  statusCode: z.number(),
});
