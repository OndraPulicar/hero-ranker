import { Character } from '@hero-ranker/shared/schemas/character';
import CharacterAvatar from './CharacterAvatar';

type CharacterMatrixViewProps = {
  characters: Character[];
};

const AVATAR_RADIUS = 40;

function getInsetPosition(value: number, offset = 0) {
  const pixelOffset = AVATAR_RADIUS * (1 - (2 * value) / 100) + offset;
  const operator = pixelOffset < 0 ? '-' : '+';

  return `calc(${value}% ${operator} ${Math.abs(pixelOffset)}px)`;
}

export default function CharacterMatrixView({
  characters,
}: CharacterMatrixViewProps) {
  const characterGroups = new Map<string, Character[]>();
  for (const character of characters) {
    const karma =
      character.totalVotes > 0
        ? character.evilVotes / character.totalVotes
        : 0.5;
    const rating =
      character.totalVotes > 0
        ? character.points / character.totalVotes / 3
        : 0;
    const key = `${karma}:${rating}`;
    const group = characterGroups.get(key);
    if (group) {
      group.push(character);
    } else {
      characterGroups.set(key, [character]);
    }
  }

  return (
    <section>
      <h3 className="mb-2 text-lg font-bold">Character matrix</h3>
      <div className="flex gap-2">
        <span className="self-stretch text-center text-[11px] font-bold tracking-wider text-gray-400 uppercase [writing-mode:vertical-rl] rotate-180">
          Rating
        </span>
        <div className="ml-6 flex-1">
          <div
            aria-label="Characters plotted by rating and karma"
            className="relative aspect-[4/3] w-full"
            style={{
              backgroundImage: `
                linear-gradient(
                  to right,
                  var(--good),
                  #fda4af 50%,
                  var(--evil)
                ),
                linear-gradient(to right, rgb(255 255 255 / 0.45) 1px, transparent 1px),
                linear-gradient(to bottom, rgb(255 255 255 / 0.45) 1px, transparent 1px)
              `,
              backgroundSize: '100% 100%, 10% 100%, 100% 10%',
            }}
          >
            {[...characterGroups.values()].map((group) => {
              const character = group[0];
              const hasVotes = character.totalVotes > 0;
              const karma = hasVotes
                ? (character.evilVotes / character.totalVotes) * 100
                : 50;
              const rating = hasVotes
                ? (character.points / character.totalVotes / 3) * 10
                : 0;

              return (
                <div
                  key={character.id}
                  className="absolute z-[1] -translate-x-1/2 hover:z-20 focus-within:z-20"
                  style={{
                    left: getInsetPosition(karma),
                    top: getInsetPosition(100 - rating * 10, -AVATAR_RADIUS),
                  }}
                >
                  <div className="relative">
                    <CharacterAvatar character={character} />
                    {group.length > 1 && (
                      <div className="absolute left-[88px] -top-3 flex flex-row -space-x-2">
                        {group.slice(1).map((groupCharacter) => (
                          <CharacterAvatar
                            key={groupCharacter.id}
                            character={groupCharacter}
                            size="small"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 right-full mr-2 w-6 text-right text-[11px] font-bold text-gray-400"
            >
              {Array.from({ length: 11 }, (_, index) => (
                <span
                  key={index}
                  className="absolute right-0"
                  style={{
                    top: getInsetPosition(index * 10),
                    transform:
                      index === 0
                        ? 'translateY(0)'
                        : index === 10
                          ? 'translateY(-100%)'
                          : 'translateY(-50%)',
                  }}
                >
                  {10 - index}
                </span>
              ))}
            </div>
          </div>
          <div className="relative mt-2 h-4 text-[11px] font-bold tracking-wider text-gray-400 uppercase">
            {[0, 50, 100].map((value) => (
              <span
                key={value}
                className="absolute -translate-x-1/2 whitespace-nowrap"
                style={{ left: getInsetPosition(value) }}
              >
                {value === 50
                  ? 'Neutral'
                  : value === 0
                    ? '100% Good'
                    : 'Evil 100%'}
              </span>
            ))}
          </div>
          <div className="mt-2 text-center text-[11px] font-bold tracking-wider text-gray-400 uppercase">
            Karma
          </div>
        </div>
      </div>
    </section>
  );
}
