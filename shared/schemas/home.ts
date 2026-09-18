import { z } from "zod";
import { SeriesCardSchema } from "./series";
import { CharacterCardSchema } from "./character";


export const HomeDataSchema = z.object({
  topSeries: z.array(SeriesCardSchema),
  topCharacters: z.array(CharacterCardSchema)
})

export type HomeData = z.infer<typeof HomeDataSchema>;