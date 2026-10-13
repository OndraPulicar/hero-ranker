'use client';

import Card from '@/app/components/Card';
import Status from '@/app/components/Status';
import { getImageUrl } from '@/common';
import { getSeries } from '@/services/series.service';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { useParams } from 'next/navigation';

export default function Series() {
  const params = useParams<{ id: string }>();

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
      <section>
        <h3 className="text-lg font-bold mb-2">Seasons</h3>
        {series.seasons.map((season) => (
          <span key={season.id} className="pr-4">
            {season.alternativeTitle ?? `Season ${season.seasonNumber}`}
          </span>
        ))}
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
