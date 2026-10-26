import { z } from 'zod';
import { VoteSchema } from '@hero-ranker/shared/schemas/votes';

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
});

export const CharacterCardSchema = CharacterSchema.pick({
  id: true,
  name: true,
  imageKey: true,
  totalVotes: true,
});

export const CharacterDetailSchema = CharacterSchema.extend({
  rank: z.number().nullable(),
  vote: VoteSchema.nullable().optional(),
  ratingInfo: z.string(),
});

export type Character = z.infer<typeof CharacterSchema>;
export type CharacterCard = z.infer<typeof CharacterCardSchema>;
export type CharacterDetail = z.infer<typeof CharacterDetailSchema>;
