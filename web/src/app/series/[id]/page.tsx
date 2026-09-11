import Card from "@/app/components/Card";
import Image from "next/image";

export default async function Series({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const response = await fetch(`http://localhost:3001/series/${id}`);
  const series = await response.json();

  return (
    <div className="flex flex-col gap-4 w-full mx-auto max-w-7xl px-6 py-10">
      <section className="">
        <h1 className="text-2xl font-bold mb-2">{series.title}</h1>
        <h2 className="text-lg font-bold mb-2">
          {series.yearOfProduction}
        </h2>
      </section>
      <section className="flex flex-row gap-4">
        <Image
          src={`/images/series/breaking-bad.jpg`}
          alt="{series.title}"
          width={150}
          height={150}
        />
        <div className="max-w-xl text-justify">A chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine with a former student to secure his family&apos;s future.</div>
      </section>
      <section>
        <h3 className="text-lg font-bold mb-2">
          Seasons
        </h3>
        {series.seasons.map((season: { id: number; title: string; seasonNumber: number; alternativeTitle: string }) => (
          <span key={season.id} className="pr-4">
            {season.alternativeTitle || `Season ${season.seasonNumber}`}
          </span>
        ))}
      </section>
      <section>
        <h3 className="text-lg font-bold mb-2">
          Characters
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {series.characters.map((character: { id: number; name: string; }) => (
            <Card key={character.id} data={{ id: character.id, resource: "characters", title: character.name, imageUrl: "jesse-pinkman.jpg" }} />
          ))}
        </div>
      </section>
    </div>
  );
}