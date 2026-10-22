'use client';

import Card from '@/app/components/Card';
import Status from '@/app/components/Status';
import { getImageUrl } from '@/common';
import { getSeries } from '@/services/series.service';
import { useQuery } from '@tanstack/react-query';
import { ChevronDown } from 'lucide-react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useState } from 'react';

type CharacterFilter = {
  season: number | 'ALL';
  karma: 'GOOD' | 'NEUTRAL' | 'EVIL' | 'ALL';
  sort: 'RATING' | 'NAME' | 'KARMA';
};

export default function Series() {
  const params = useParams<{ id: string }>();

  const [filters, setFilters] = useState<CharacterFilter>({
    season: 'ALL',
    karma: 'ALL',
    sort: 'RATING',
  });

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
      <h3 className="text-lg font-bold">Filters</h3>
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="flex flex-col gap-2">
          <label
            htmlFor="season-filter"
            className="text-sm font-semibold text-[#edddd4]"
          >
            Season
          </label>

          <div className="relative">
            <select
              id="season-filter"
              value={filters.season}
              onChange={(event) =>
                setFilters((prev) => ({
                  ...prev,
                  season:
                    event.target.value === 'ALL'
                      ? 'ALL'
                      : Number(event.target.value),
                }))
              }
              className="w-full appearance-none rounded-lg border border-[#3b3e4b] bg-[#232631] px-3 py-2.5 text-sm text-white outline-none transition-colors hover:border-[#8d99ae] focus:border-[#D90429] focus:ring-2 focus:ring-[#D90429]/20"
            >
              <option value="ALL">All seasons</option>

              {series.seasons.map((season) => (
                <option key={season.id} value={season.id}>
                  {season.alternativeTitle ?? `Season ${season.seasonNumber}`}
                </option>
              ))}
            </select>
            <ChevronDown
              aria-hidden="true"
              className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-white"
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label
            htmlFor="karma-filter"
            className="text-sm font-semibold text-[#edddd4]"
          >
            Karma
          </label>

          <div className="relative">
            <select
              id="karma-filter"
              value={filters.karma}
              onChange={(event) =>
                setFilters((prev) => ({
                  ...prev,
                  karma: event.target.value as CharacterFilter['karma'],
                }))
              }
              className="w-full appearance-none rounded-lg border border-[#3b3e4b] bg-[#232631] px-3 py-2.5 text-sm text-white outline-none transition-colors hover:border-[#8d99ae] focus:border-[#D90429] focus:ring-2 focus:ring-[#D90429]/20"
            >
              <option value="ALL">All karma</option>
              <option value="GOOD">Good</option>
              <option value="NEUTRAL">Neutral</option>
              <option value="EVIL">Evil</option>
            </select>
            <ChevronDown
              aria-hidden="true"
              className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-white"
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label
            htmlFor="sort-filter"
            className="text-sm font-semibold text-[#edddd4]"
          >
            Sort by
          </label>

          <div className="relative">
            <select
              id="sort-filter"
              value={filters.sort}
              onChange={(event) =>
                setFilters((prev) => ({
                  ...prev,
                  sort: event.target.value as CharacterFilter['sort'],
                }))
              }
              className="w-full appearance-none rounded-lg border border-[#3b3e4b] bg-[#232631] px-3 py-2.5 text-sm text-white outline-none transition-colors hover:border-[#8d99ae] focus:border-[#D90429] focus:ring-2 focus:ring-[#D90429]/20"
            >
              <option value="RATING">Rating</option>
              <option value="NAME">Name</option>
              <option value="KARMA">Karma (good &gt; bad)</option>
            </select>
            <ChevronDown
              aria-hidden="true"
              className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-white"
            />
          </div>
        </div>
      </section>
      <section>
        <h3 className="text-lg font-bold mb-2">Characters</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
          {series.characters.map(
            (character: {
              id: number;
              name: string;
              imageKey: string | null;
              totalVotes: number;
            }) => (
              <Card
                key={character.id}
                data={{
                  id: character.id,
                  resource: 'characters',
                  title: character.name,
                  imageUrl: getImageUrl(character.imageKey),
                  totalVotes: character.totalVotes,
                }}
              />
            ),
          )}
        </div>
      </section>
    </div>
  );
}
