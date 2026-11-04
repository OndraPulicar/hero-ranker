'use client';

import Status from '@/app/components/Status';
import CharacterDetailView from '@/features/characters/components/CharacterDetailView';
import useCharacterDetailPage from '@/features/characters/hooks/useCharacterDetailPage';
import { useParams } from 'next/navigation';

export default function Character() {
  const { id } = useParams<{ id: string }>();
  const characterId = Number.parseInt(id, 10);
  const { character, user, ratingModal, submitVote } =
    useCharacterDetailPage(characterId);

  if (character.isPending) {
    return <Status type="INFO">Loading character...</Status>;
  }

  if (character.error) {
    return <Status type="ERROR">Failed to load character.</Status>;
  }

  if (!character.data) {
    return <Status type="INFO">Character not found.</Status>;
  }

  return (
    <CharacterDetailView
      character={character.data}
      userInfo={user.data}
      isUserPending={user.isPending}
      userError={Boolean(user.error)}
      isRatingModalOpen={ratingModal.isOpen}
      onOpenRatingModal={ratingModal.open}
      onCloseRatingModal={ratingModal.close}
      onSubmitVote={(isEvil, points) =>
        submitVote({
          isEvil,
          points,
          voteId: character.data?.vote?.id,
        })
      }
    />
  );
}
