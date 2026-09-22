import { z } from 'zod';

export const VoteSchema = z.object({
  id: z.number(),
  characterId: z.number(),
  userId: z.number(),
  isEvil: z.boolean(),
  points: z.union([z.literal(1), z.literal(2), z.literal(3)]),
});

export type Vote = z.infer<typeof VoteSchema>;
