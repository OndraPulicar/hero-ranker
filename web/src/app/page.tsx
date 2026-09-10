import SeriesCard from "./components/Card";
import Card from "./components/Card";
import CharacterCard from "./components/CharacterCard";

type Resources = "series" | "characters";

type ResourceItem = {
  id: number;
  resource: Resources;
  title: string;
  imageUrl: string;
};

const seriesList: ResourceItem[] = [
  { id: 1, resource: "series", title: "Breaking Bad", imageUrl: "breaking-bad.jpg" },
  { id: 2, resource: "series", title: "Game of Thrones", imageUrl: "game-of-thrones.jpg" },
  { id: 3, resource: "series", title: "Stranger Things", imageUrl: "stranger-things.jpg" },
  { id: 4, resource: "series", title: "Dexter", imageUrl: "dexter.jpg" },
  { id: 5, resource: "series", title: "The Mandalorian", imageUrl: "the-mandalorian.jpg" },
];

const characterList: ResourceItem[] = [
  { id: 1, resource: "characters", title: "Walter White", imageUrl: "walter-white.jpg" },
  { id: 2, resource: "characters", title: "Jesse Pinkman", imageUrl: "jesse-pinkman.jpg" },
  { id: 3, resource: "characters", title: "Daenerys Targaryen", imageUrl: "daenerys-targaryen.jpg" },
  { id: 4, resource: "characters", title: "Jon Snow", imageUrl: "jon-snow.jpg" },
  { id: 5, resource: "characters", title: "Dexter Morgan", imageUrl: "dexter-morgan-2.jpg" },
];

export default function Home() {
  return (
    <main className="w-full mx-auto max-w-7xl px-6 py-10">
      <h1 className="text-3xl font-bold text-center mb-10">Rank your favorite heroes and villains!</h1>
      <div>
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-6">Popular series</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {seriesList.map((series) => (
              <Card key={series.id} data={series} />
            ))}
          </div>
        </section>
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-6">Popular characters</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {characterList.map((character) => (
              <Card key={character.id} data={character} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}