import { getImageUrl } from '@/common';
import Card from './Card';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getCharacters } from '@/services/character.service';
import Status from './Status';
import {
  Character,
  CharacterFilters,
} from '@hero-ranker/shared/schemas/character';

type CharactersProps = {
  seriesId: string;
  filters: CharacterFilters;
};

export default function Characters({ seriesId, filters }: CharactersProps) {
  const {
    data: characters,
    isPending,
    error,
  } = useQuery({
    queryKey: ['characters', seriesId, filters],
    queryFn: () => getCharacters(seriesId, filters),
    placeholderData: keepPreviousData,
  });

  if (isPending) {
    return <Status type="INFO">Loading characters...</Status>;
  }

  if (error) {
    return <Status type="ERROR">Failed to load characters.</Status>;
  }

  if (characters === null) {
    return (
      <Status type="INFO">There are no characters for this series.</Status>
    );
  }

  return (
    <section>
      <h3 className="text-lg font-bold mb-2">Characters</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
        {characters.map((character: Character) => (
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
