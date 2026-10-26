import { API_URL } from '@/config';
import { CharacterFilters } from '@/types/character';
import {
  CharacterDetailSchema,
  CharacterSchema,
} from '@hero-ranker/shared/schemas/character';
import { z } from 'zod';

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

  return CharacterDetailSchema.parse(responseJson);
};

export const getCharacters = async (
  seriesId: string,
  filters: CharacterFilters,
) => {
  const searchParams = new URLSearchParams({
    seriesId: seriesId,
    sort: filters.sort,
  });
  if (filters.season !== 'ALL') {
    searchParams.set('season', String(filters.season));
  }

  if (filters.karma !== 'ALL') {
    searchParams.set('karma', filters.karma);
  }

  const response = await fetch(`${API_URL}/characters?${searchParams}`, {
    credentials: 'include',
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`Failed to load characters (${response.status})`);
  }

  const responseJson = (await response.json()) as unknown[];

  return z.array(CharacterSchema).parse(responseJson);
};
