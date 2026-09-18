import z from "zod";

export const SeasonSchema = z.object({
  id: z.number(),
  seasonNumber: z.number(),
  alternativeTitle: z.string().nullable(),
  seriesId: z.number()
});

export type Season = z.infer<typeof SeasonSchema>;