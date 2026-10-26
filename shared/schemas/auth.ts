import { z } from 'zod';

export const LoginErrorSchema = z.object({
  error: z.string(),
  message: z.string(),
  statusCode: z.number(),
});

export const AuthTokenSchema = z.object({
  accessToken: z.string(),
});
