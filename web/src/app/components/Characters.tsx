import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getCharacters } from '@/services/character.service';
import Status from './Status';
import { CharacterFilters } from '@hero-ranker/shared/schemas/character';
import CharacterListView from './CharacterListView';

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

  return <CharacterListView characters={characters} />;
}
