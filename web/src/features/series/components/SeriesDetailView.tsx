'use client';

import CharacterFilters from '@/app/components/CharacterFilters';
import Characters, { type CharacterView } from '@/app/components/Characters';
import CharacterViewSwitcher from '@/app/components/CharacterViewSwitcher';
import { getImageUrl } from '@/common';
import type { CharacterFilters as CharacterFiltersType } from '@hero-ranker/shared/schemas/character';
import type { SeriesDetail } from '@hero-ranker/shared/schemas/series';
import Image from 'next/image';

type SeriesDetailViewProps = {
  series: SeriesDetail;
  seriesId: string;
  filters: CharacterFiltersType;
  setFilters: React.Dispatch<React.SetStateAction<CharacterFiltersType>>;
  characterView: CharacterView;
  setCharacterView: (view: CharacterView) => void;
};

export default function SeriesDetailView({
  series,
  seriesId,
  filters,
  setFilters,
  characterView,
  setCharacterView,
}: SeriesDetailViewProps) {
  return (
    <div className="flex flex-col gap-4 w-full mx-auto max-w-3xl px-6 py-10">
      <section>
        <h1 className="text-2xl font-bold mb-2">{series.title}</h1>
        <h2 className="text-lg font-bold mb-2">{series.yearOfProduction}</h2>
      </section>
      <section className="flex flex-row gap-4">
        <Image
          src={getImageUrl(series.imageKey)}
          alt={series.title}
          width={150}
          height={150}
        />
        <div className="max-w-xl text-justify">{series.description}</div>
      </section>
      <CharacterFilters
        filters={filters}
        setFilters={setFilters}
        seasons={series.seasons}
      />
      <CharacterViewSwitcher view={characterView} onChange={setCharacterView} />
      <Characters seriesId={seriesId} filters={filters} view={characterView} />
    </div>
  );
}
