'use client';

import Status from '@/app/components/Status';
import SeriesDetailView from '@/features/series/components/SeriesDetailView';
import useSeriesPage from '@/features/series/hooks/useSeriesPage';
import { useParams } from 'next/navigation';

export default function Series() {
  const { id } = useParams<{ id: string }>();
  const {
    series: { data: series, isPending, error },
    filters,
    setFilters,
    characterView,
    setCharacterView,
  } = useSeriesPage(id);

  if (isPending) {
    return <Status type="INFO">Loading series...</Status>;
  }

  if (error) {
    return <Status type="ERROR">Error while loading series.</Status>;
  }

  if (!series) {
    return <Status type="INFO">Series not found.</Status>;
  }

  return (
    <SeriesDetailView
      series={series}
      seriesId={id}
      filters={filters}
      setFilters={setFilters}
      characterView={characterView}
      setCharacterView={setCharacterView}
    />
  );
}
