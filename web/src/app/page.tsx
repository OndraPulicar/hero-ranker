import { API_URL } from "@/config";
import Card from "./components/Card";

export function getImageUrl(imageKey: string | null) {
  if (!imageKey) return null;

  return `${process.env.NEXT_PUBLIC_S3_HOSTNAME}/${imageKey}`;
}

export type HomeData = {
  topSeries: {
    id: number;
    title: string;
    imageKey: string | null;
    totalVotes: number;
  }[];
  topCharacters: {
    id: number;
    name: string;
    imageKey: string | null;
    totalVotes: number;
  }[];
};

export default async function Home() {
  const response = await fetch(`${API_URL}/home`);
  const homeData = await response.json() as HomeData;

  return (
    <main className="w-full px-6 py-10">
      <h1 className="text-3xl font-bold text-center mb-10">Rank your favorite heroes and villains!</h1>
      <div>
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-6">Popular series</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {homeData.topSeries.map((series) => (
              <Card key={series.id} data={{
                id: series.id,
                title: series.title,
                imageUrl: getImageUrl(series.imageKey),
                resource: "series"
              }} />
            ))}
          </div>
        </section>
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-6">Popular characters</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {homeData.topCharacters.map((character) => (
              <Card key={character.id} data={{
                id: character.id,
                title: character.name,
                imageUrl: getImageUrl(character.imageKey),
                resource: "characters"
              }} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}