import { getImageUrl } from '@/common';
import { Character } from '@hero-ranker/shared/schemas/character';
import Card from './Card';

type CharacterListViewProps = {
  characters: Character[];
};

export default function CharacterListView({
  characters,
}: CharacterListViewProps) {
  return (
    <section>
      <h3 className="text-lg font-bold mb-2">Characters</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
        {characters.map((character) => (
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
        ))}
      </div>
    </section>
  );
}
