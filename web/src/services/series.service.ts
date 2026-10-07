import { API_URL } from '@/config';
import { SeriesDetailSchema } from '@hero-ranker/shared/schemas/series';

export const getSeries = async (id: string) => {
  const response = await fetch(`${API_URL}/series/${id}`);

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`Failed to load series (${response.status})`);
  }

  const responseJson = (await response.json()) as unknown;

  return SeriesDetailSchema.parse(responseJson);
};
