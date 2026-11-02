'use client';

import Status from '@/app/components/Status';
import { getImageUrl } from '@/common';
import { getSeries } from '@/services/series.service';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { CharacterFilters as CharacterFiltersType } from '@hero-ranker/shared/schemas/character';
import CharacterFilters from '@/app/components/CharacterFilters';
import Characters, { type CharacterView } from '@/app/components/Characters';
import CharacterViewSwitcher from '@/app/components/CharacterViewSwitcher';

export default function Series() {
  const params = useParams<{ id: string }>();

  const [filters, setFilters] = useState<CharacterFiltersType>({
    season: 'ALL',
    karma: 'ALL',
    sortBy: 'RATING',
  });
  const [characterView, setCharacterView] = useState<CharacterView>('list');

  const {
    data: series,
    isPending,
    error,
  } = useQuery({
    queryKey: ['series', params.id],
    queryFn: () => getSeries(params.id),
  });

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
    <div className="flex flex-col gap-4 w-full mx-auto max-w-3xl px-6 py-10">
      <section className="">
        <h1 className="text-2xl font-bold mb-2">{series.title}</h1>
        <h2 className="text-lg font-bold mb-2">{series.yearOfProduction}</h2>
      </section>
      <section className="flex flex-row gap-4">
        <Image
          src={getImageUrl(series.imageKey)}
          alt="{series.title}"
          width={150}
          height={150}
        />
        <div className="max-w-xl text-justify">{series.description}</div>
      </section>
      <CharacterFilters
        filters={filters}
        setFilters={setFilters}
        seasons={series.seasons}
      ></CharacterFilters>
      <CharacterViewSwitcher view={characterView} onChange={setCharacterView} />
      <Characters
        seriesId={params.id}
        filters={filters}
        view={characterView}
      ></Characters>
    </div>
  );
}
