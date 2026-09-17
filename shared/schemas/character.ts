import { z } from 'zod';

export const CharacterSchema = z.object({
  id: z.number(),
  name: z.string(),
  alternativeName: z.string().nullable(),
  seriesId: z.number(),
  appearsInAllSeasons: z.boolean(),
  totalVotes: z.number(),
  evilVotes: z.number(),
  points: z.number(),
  imageKey: z.string().nullable()
});

export type Character = z.infer<typeof CharacterSchema>;