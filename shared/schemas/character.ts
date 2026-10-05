import { z } from 'zod';
import { VoteSchema } from './votes';

export const CharacterSchema = z.object({
  id: z.number(),
  name: z.string(),
  alternativeName: z.string().nullable(),
  seriesId: z.number(),
  appearsInAllSeasons: z.boolean(),
  totalVotes: z.number(),
  evilVotes: z.number(),
  points: z.number(),
  imageKey: z.string().nullable(),
  vote: VoteSchema.nullable().optional(),
});

export const CharacterCardSchema = CharacterSchema.pick({
  id: true,
  name: true,
  imageKey: true,
  totalVotes: true,
});

export type Character = z.infer<typeof CharacterSchema>;
export type CharacterCard = z.infer<typeof CharacterCardSchema>;
