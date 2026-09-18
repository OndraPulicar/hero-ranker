import { z } from 'zod';

export const VoteSchema = z.object({
  id: z.number(),
  characterId: z.number(),
  userId: z.number(),
  isEvil: z.boolean(),
  points: z.number()
});

export type Vote = z.infer<typeof VoteSchema>;