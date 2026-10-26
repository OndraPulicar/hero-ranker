import { z } from 'zod';
import { SeriesCardSchema } from '@hero-ranker/shared/schemas/series';
import { CharacterCardSchema } from '@hero-ranker/shared/schemas/character';

export const HomeDataSchema = z.object({
  topSeries: z.array(SeriesCardSchema),
  topCharacters: z.array(CharacterCardSchema),
});

export type HomeData = z.infer<typeof HomeDataSchema>;
