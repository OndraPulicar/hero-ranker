import { API_URL } from '@/config';
import { SearchResultSchema } from '@hero-ranker/shared/schemas/search';

export const search = async (query: string) => {
  const encodedUrl = `${API_URL}/search?q=${encodeURIComponent(query)}`;
  const response = await fetch(encodedUrl);
  if (!response.ok) {
    throw new Error('Search failed.');
  }
  const responseJson = (await response.json()) as unknown;

  const res = SearchResultSchema.parse(responseJson);

  return res;
};
