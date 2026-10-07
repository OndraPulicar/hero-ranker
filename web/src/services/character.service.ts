import { API_URL } from '@/config';
import { CharacterSchema } from '@hero-ranker/shared/schemas/character';

export const getCharacter = async (id: number) => {
  const response = await fetch(`${API_URL}/characters/${id}`, {
    credentials: 'include',
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`Failed to load character (${response.status})`);
  }

  const responseJson = (await response.json()) as unknown;

  return CharacterSchema.parse(responseJson);
};
