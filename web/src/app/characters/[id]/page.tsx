'use client';

import CharacterRatingModal from '@/app/components/CharacterRatingModal';
import Status from '@/app/components/Status';
import { getImageUrl } from '@/common';
import { getCharacter } from '@/services/character.service';
import { saveVote } from '@/services/vote.service';
import { CharacterDetail } from '@hero-ranker/shared/schemas/character';
import { VotePoints } from '@hero-ranker/shared/schemas/votes';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  FaceNeutral,
  PencilSparkles,
  ThumbsDown,
  ThumbsUp,
} from 'lucide-react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useState } from 'react';

export default function Character() {
  const params = useParams();
  const id = parseInt(params.id as string);

  const [isRatingModalOpen, setIsRatingModalOpen] = useState<boolean>(false);

  const queryClient = useQueryClient();
  const {
    data: character,
    isPending,
    error,
  } = useQuery<CharacterDetail | null>({
    queryKey: ['character', id],
    queryFn: () => getCharacter(id),
  });

  const voteMutation = useMutation({
    mutationFn: async ({
      voteId,
      characterId,
      isEvil,
      points,
    }: {
      voteId?: number;
      characterId: number;
      isEvil: boolean;
      points: VotePoints;
    }) => {
      await saveVote({ voteId, characterId, isEvil, points });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['character', id],
      });
    },
  });

  if (isPending) {
    return <Status type="INFO">Loading character...</Status>;
  }

  if (error) {
    return <Status type="ERROR">Failed to load character.</Status>;
  }

  if (!character) {
    return <Status type="INFO">Character not found.</Status>;
  }

  return (
    <div className="mx-auto w-full max-w-3xl bg-[#0d1017] p-4 text-white font-sans md:p-6">
      <div className="flex flex-col gap-6 md:flex-row md:items-stretch">
        <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden rounded-2xl md:w-72 md:aspect-[4/5]">
          <Image
            src={getImageUrl(character.imageKey)}
            alt={character.name}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30" />

          <div className="absolute left-4 top-4 rounded-full bg-black/50 px-3 py-1 text-xs font-semibold backdrop-blur-md">
            #{character.rank}
          </div>

          <div className="absolute bottom-4 left-4 right-4">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-500/90">
              Character Rating
            </span>
            <h2 className="text-2xl font-black leading-tight text-white md:text-3xl">
              {character.name}
            </h2>
          </div>
        </div>

        <div className="flex flex-1 flex-col justify-between py-1">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-xs font-bold tracking-wider text-gray-400 uppercase">
                Audience Score
              </h3>
              <p className="mt-1 text-base font-medium text-gray-300">
                {character.totalVotes === 0
                  ? 'Nobody has voted yet, be the first!'
                  : character.ratingInfo}
              </p>
            </div>

            <div className="flex items-baseline rounded-2xl bg-[#facc15] px-4 py-3 text-black">
              <span className="text-3xl font-black md:text-4xl">
                {character.points === 0
                  ? 'N/A'
                  : Math.round(
                      (character.points / character.totalVotes / 3) * 10,
                    )}
              </span>
              <span className="ml-1 text-xs font-bold opacity-75">
                {character.points !== 0 ? '/10' : ''}
              </span>
            </div>
          </div>

          <div className="my-6">
            <div className="relative mb-1 mt-6">
              <div
                className="absolute bottom-full mb-1 flex -translate-x-1/2 flex-col items-center"
                style={{
                  left:
                    character.evilVotes > 0
                      ? (character.evilVotes / character.totalVotes) * 100 + '%'
                      : character.totalVotes > 0
                        ? '0%'
                        : '50%',
                }}
              >
                <span className="text-xs text-gray-400 leading-none">▼</span>
              </div>

              <div className="h-2 w-full rounded-full bg-gradient-to-r from-good via-rose-300 to-evil" />
            </div>

            <div className="flex justify-between text-[11px] font-bold tracking-wider text-gray-400">
              <span>GOOD</span>
              <span>NEUTRAL</span>
              <span>EVIL</span>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center">
            <button
              onClick={() => {
                setIsRatingModalOpen(true);
              }}
              className={`${
                character.vote
                  ? character.vote.isEvil
                    ? 'bg-evil'
                    : 'bg-good'
                  : 'bg-gray-800/80'
              } group flex flex-col items-center justify-center gap-1 rounded-2xl p-3.5 text-gray-200 transition-all hover:scale-105 active:scale-95 cursor-pointer`}
            >
              {character.vote ? (
                character.vote.points === 1 ? (
                  <ThumbsDown className="h-6 w-6" />
                ) : character.vote.points === 2 ? (
                  <FaceNeutral className="h-6 w-6" />
                ) : (
                  <ThumbsUp className="h-6 w-6" />
                )
              ) : (
                <PencilSparkles className="h-6 w-6 text-gray-300 transition-transform group-hover:rotate-12" />
              )}
            </button>
            <span className="mt-2 text-[10px] font-bold tracking-widest text-gray-400 uppercase">
              {character.vote ? 'Your Vote' : 'Vote Now!'}
            </span>
          </div>
        </div>
      </div>
      {isRatingModalOpen && (
        <CharacterRatingModal
          onSubmit={(isEvil, points) => {
            voteMutation.mutate({
              isEvil,
              points,
              voteId: character.vote?.id,
              characterId: id,
            });
          }}
          onClose={() => setIsRatingModalOpen(false)}
          userVote={character.vote ?? undefined}
        ></CharacterRatingModal>
      )}
    </div>
  );
}
