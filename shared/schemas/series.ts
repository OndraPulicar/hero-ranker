import { z } from 'zod';
import { SeasonSchema } from './seasons';

export const SeriesSchema = z.object({
  id: z.number(),
  title: z.string(),
  yearOfProduction: z.number(),
  isLimited: z.boolean(),
  imageKey: z.string().nullable(),
  description: z.string(),
  seasons: z.array(SeasonSchema).optional()
});

export type Season = z.infer<typeof SeriesSchema>;