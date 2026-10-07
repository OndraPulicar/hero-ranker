'use client';

import { API_URL } from '@/config';
import Card from './components/Card';
import { getImageUrl } from '@/common';
import { HomeDataSchema } from '@hero-ranker/shared/schemas/home';
import { useQuery } from '@tanstack/react-query';

export default function Home() {
  const {
    data: homeData,
    error,
    isPending,
  } = useQuery({
    queryKey: ['home'],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/home`);
      return HomeDataSchema.parse(await response.json());
    },
  });

  if (isPending) {
    return <p className="p-6 text-center text-gray-300">Loading data...</p>;
  }

  if (error) {
    return <p className="p-6 text-center text-red-400">Failed to load data.</p>;
  }

  return (
    <main className="w-full px-6 py-10">
      <h1 className="text-3xl font-bold text-center mb-10">
        Rank your favorite heroes and villains!
      </h1>
      <div>
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-6">Popular series</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {homeData.topSeries.map((series) => (
              <Card
                key={series.id}
                data={{
                  id: series.id,
                  title: series.title,
                  imageUrl: getImageUrl(series.imageKey),
                  resource: 'series',
                  totalVotes: series.totalVotes,
                }}
              />
            ))}
          </div>
        </section>
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-6">Popular characters</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {homeData.topCharacters.map((character) => (
              <Card
                key={character.id}
                data={{
                  id: character.id,
                  title: character.name,
                  imageUrl: getImageUrl(character.imageKey),
                  resource: 'characters',
                  totalVotes: character.totalVotes,
                }}
              />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
