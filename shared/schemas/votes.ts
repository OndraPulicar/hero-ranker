import { z } from 'zod';

export const VotePointsSchema = z.union([
  z.literal(1),
  z.literal(2),
  z.literal(3),
]);

export const VoteSchema = z.object({
  id: z.number(),
  characterId: z.number(),
  userId: z.number(),
  isEvil: z.boolean(),
  points: VotePointsSchema,
});

export type Vote = z.infer<typeof VoteSchema>;
export type VotePoints = z.infer<typeof VotePointsSchema>;
