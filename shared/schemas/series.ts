import { z } from 'zod';
import { SeasonSchema } from './season';

export const SeriesSchema = z.object({
  id: z.number(),
  title: z.string(),
  yearOfProduction: z.number(),
  isLimited: z.boolean(),
  imageKey: z.string().nullable(),
  description: z.string(),
  seasons: z.array(SeasonSchema).optional(),
});

export const SeriesWithVotesSchema = SeriesSchema.extend({
  totalVotes: z.number(),
});

export const SeriesDetailSchema = SeriesSchema.extend({
  seasons: z.array(SeasonSchema),
});

export const SeriesCardSchema = SeriesSchema.pick({
  id: true,
  title: true,
  imageKey: true,
}).extend({
  totalVotes: z.number(),
});

export type Series = z.infer<typeof SeriesSchema>;
export type SeriesDetail = z.infer<typeof SeriesDetailSchema>;
export type SeriesWithVotes = z.infer<typeof SeriesWithVotesSchema>;
export type SeriesCard = z.infer<typeof SeriesCardSchema>;
