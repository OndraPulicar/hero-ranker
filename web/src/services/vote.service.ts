import { API_URL } from '@/config';
import { VotePoints } from '@hero-ranker/shared/schemas/votes';

export const saveVote = async ({
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
  const requestParams = {
    credentials: 'include' as const,
    headers: {
      'Content-Type': 'application/json',
    },
  };
  let response;

  if (voteId !== undefined) {
    response = await fetch(`${API_URL}/votes/${voteId}`, {
      ...requestParams,
      method: 'PATCH',
      body: JSON.stringify({
        points,
        isEvil,
      }),
    });
  } else {
    response = await fetch(`${API_URL}/votes`, {
      ...requestParams,
      method: 'POST',
      body: JSON.stringify({
        characterId,
        points,
        isEvil,
      }),
    });
  }

  if (!response.ok) {
    throw new Error(`Failed to save vote (${response.status})`);
  }
};
