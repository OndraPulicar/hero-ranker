import { z } from 'zod';

export const UserSchema = z.object({
  id: z.number(),
  username: z.string(),
  email: z.string(),
  passwordHash: z.string(),
});

export const UserInfoSchema = UserSchema.pick({
  username: true,
  email: true,
});

export type UserInfo = z.infer<typeof UserInfoSchema>;
