import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getCharacters } from '@/services/character.service';
import Status from './Status';
import { CharacterFilters } from '@hero-ranker/shared/schemas/character';
import CharacterListView from './CharacterListView';
import CharacterMatrixView from './CharacterMatrixView';

export type CharacterView = 'list' | 'matrix';

type CharactersProps = {
  seriesId: string;
  filters: CharacterFilters;
  view: CharacterView;
};

export default function Characters({
  seriesId,
  filters,
  view,
}: CharactersProps) {
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

  return view === 'list' ? (
    <CharacterListView characters={characters} />
  ) : (
    <CharacterMatrixView />
  );
}
