'use client';

import { getSeries } from '@/services/series.service';
import { CharacterView } from '@/app/components/Characters';
import { CharacterFilters } from '@hero-ranker/shared/schemas/character';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

export default function useSeriesPage(seriesId: string) {
  const [filters, setFilters] = useState<CharacterFilters>({
    season: 'ALL',
    karma: 'ALL',
    sortBy: 'RATING',
  });
  const [characterView, setCharacterView] = useState<CharacterView>('list');
  const seriesQuery = useQuery({
    queryKey: ['series', seriesId],
    queryFn: () => getSeries(seriesId),
  });

  return {
    series: {
      data: seriesQuery.data,
      isPending: seriesQuery.isPending,
      error: seriesQuery.error,
    },
    filters,
    setFilters,
    characterView,
    setCharacterView,
  };
}
