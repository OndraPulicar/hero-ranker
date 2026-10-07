import { API_URL } from '@/config';
import { HomeDataSchema } from '@hero-ranker/shared/schemas/home';

export const getHomeData = async () => {
  const response = await fetch(`${API_URL}/home`);

  if (!response.ok) {
    throw new Error(`Failed to load home data (${response.status})`);
  }

  const responseJson = (await response.json()) as unknown;

  return HomeDataSchema.parse(responseJson);
};
