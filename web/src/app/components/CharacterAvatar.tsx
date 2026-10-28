import { getImageUrl } from '@/common';
import { Character } from '@hero-ranker/shared/schemas/character';
import Image from 'next/image';
import Link from 'next/link';

type CharacterAvatarProps = {
  character: Character;
};

export default function CharacterAvatar({ character }: CharacterAvatarProps) {
  const rating =
    character.totalVotes > 0
      ? ((character.points / character.totalVotes / 3) * 10).toFixed(1)
      : 'N/A';
  const evilPercentage =
    character.totalVotes > 0
      ? Math.round((character.evilVotes / character.totalVotes) * 100)
      : null;

  return (
    <Link
      href={`/characters/${character.id}`}
      className="group relative flex w-24 flex-col items-center gap-2 text-center"
      aria-describedby={`character-avatar-tooltip-${character.id}`}
    >
      <Image
        src={getImageUrl(character.imageKey)}
        alt={character.name}
        width={80}
        height={80}
        className="size-20 rounded-full border-2 border-white/30 object-cover shadow-md transition-transform group-hover:scale-105 group-focus-visible:scale-105"
      />
      <span className="line-clamp-2 text-sm font-semibold text-text">
        {character.name}
      </span>
      <span
        id={`character-avatar-tooltip-${character.id}`}
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 w-48 -translate-x-1/2 rounded-lg bg-[#16181f] px-3 py-2 text-left text-xs text-white opacity-0 shadow-xl transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
      >
        <span className="block font-bold">{character.name}</span>
        <span className="mt-1 block">Rating: {rating}/10</span>
        <span className="block">
          Karma:{' '}
          {evilPercentage === null ? 'No votes' : `${evilPercentage}% evil`}
        </span>
        <span className="block">
          {character.totalVotes} {character.totalVotes === 1 ? 'vote' : 'votes'}
        </span>
      </span>
    </Link>
  );
}
