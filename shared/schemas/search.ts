import { z } from 'zod';
import { CharacterSchema } from '@hero-ranker/shared/schemas/character';
import { SeriesSchema } from '@hero-ranker/shared/schemas/series';

export const SearchResultCharacterSchema = CharacterSchema.pick({
  id: true,
  name: true,
  imageKey: true,
}).extend({
  series: SeriesSchema.pick({ title: true }),
});

export const SearchResultSeriesSchema = SeriesSchema.pick({
  id: true,
  title: true,
  imageKey: true,
  yearOfProduction: true,
});

export const SearchResultSchema = z.object({
  characters: z.array(SearchResultCharacterSchema),
  series: z.array(SearchResultSeriesSchema),
});

export type SearchResultCharacter = z.infer<typeof SearchResultCharacterSchema>;
export type SearchResultSeries = z.infer<typeof SearchResultSeriesSchema>;
export type SearchResult = z.infer<typeof SearchResultSchema>;
