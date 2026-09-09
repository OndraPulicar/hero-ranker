import SeriesCard from "./components/SeriesCard";
import CharacterCard from "./components/CharacterCard";

const seriesList = [
  { id: 1, name: "Breaking Bad", imageUrl: "breaking-bad.jpg" },
  { id: 2, name: "Game of Thrones", imageUrl: "game-of-thrones.jpg" },
  { id: 3, name: "Stranger Things", imageUrl: "stranger-things.jpg" },
  { id: 4, name: "Dexter", imageUrl: "dexter.jpg" },
  { id: 5, name: "The Mandalorian", imageUrl: "the-mandalorian.jpg" },
];

const characterList = [
  { id: 1, name: "Walter White", imageUrl: "walter-white.jpg" },
  { id: 2, name: "Jesse Pinkman", imageUrl: "jesse-pinkman.jpg" },
  { id: 3, name: "Daenerys Targaryen", imageUrl: "daenerys-targaryen.jpg" },
  { id: 4, name: "Jon Snow", imageUrl: "jon-snow.jpg" },
  { id: 5, name: "Dexter Morgan", imageUrl: "dexter-morgan.jpg" },
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
              <SeriesCard key={series.id} series={series} />
            ))}
          </div>
        </section>
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-6">Popular characters</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {characterList.map((character) => (
              <CharacterCard key={character.id} character={character} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}