import { getImageUrl } from '@/common';
import { Character } from '@hero-ranker/shared/schemas/character';
import Image from 'next/image';
import Link from 'next/link';

type CharacterAvatarProps = {
  character: Character;
  size?: 'normal' | 'small';
};

export default function CharacterAvatar({
  character,
  size = 'normal',
}: CharacterAvatarProps) {
  const isSmall = size === 'small';

  return (
    <Link
      href={`/characters/${character.id}`}
      className={`group relative flex ${
        isSmall ? 'size-8' : 'w-24 flex-col items-center gap-2 text-center'
      } opacity-60 transition-opacity hover:opacity-100 focus-visible:opacity-100`}
      aria-label={character.name}
      aria-describedby={`character-avatar-tooltip-${character.id}`}
    >
      <Image
        src={getImageUrl(character.imageKey)}
        alt=""
        width={isSmall ? 32 : 80}
        height={isSmall ? 32 : 80}
        className={`rounded-full border-2 border-white/30 object-cover shadow-md transition-transform ${
          isSmall ? 'size-8' : 'size-20'
        } group-hover:scale-105 group-focus-visible:scale-105`}
      />
      <span
        id={`character-avatar-tooltip-${character.id}`}
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 w-48 -translate-x-1/2 rounded-lg bg-[#16181f] px-3 py-2 text-left text-xs text-white opacity-0 shadow-xl transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
      >
        <span className="block font-bold">{character.name}</span>
        <span className="mt-1 block">Rating: {character.rating}%</span>
        <span className="block">
          Karma:{' '}
          {character.totalVotes === 0 ? 'No votes' : `${character.karma}% evil`}
        </span>
        <span className="block">
          {character.totalVotes} {character.totalVotes === 1 ? 'vote' : 'votes'}
        </span>
      </span>
    </Link>
  );
}
