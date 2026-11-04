'use client';

import { getCurrentUser } from '@/services/auth.service';
import { getCharacter } from '@/services/character.service';
import { saveVote } from '@/services/vote.service';
import { CharacterDetail } from '@hero-ranker/shared/schemas/character';
import { VotePoints } from '@hero-ranker/shared/schemas/votes';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

export default function useCharacterDetailPage(id: number) {
  const queryClient = useQueryClient();
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);

  const characterQuery = useQuery<CharacterDetail | null>({
    queryKey: ['character', id],
    queryFn: () => getCharacter(id),
  });

  const userQuery = useQuery({
    queryKey: ['me'],
    queryFn: getCurrentUser,
  });

  const voteMutation = useMutation({
    mutationFn: async ({
      voteId,
      isEvil,
      points,
    }: {
      voteId?: number;
      isEvil: boolean;
      points: VotePoints;
    }) => {
      await saveVote({ voteId, characterId: id, isEvil, points });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['character', id],
      });
    },
  });

  return {
    character: {
      data: characterQuery.data,
      isPending: characterQuery.isPending,
      error: characterQuery.error,
    },
    user: {
      data: userQuery.data,
      isPending: userQuery.isPending,
      error: userQuery.error,
    },
    ratingModal: {
      isOpen: isRatingModalOpen,
      open: () => setIsRatingModalOpen(true),
      close: () => setIsRatingModalOpen(false),
    },
    submitVote: voteMutation.mutate,
  };
}
