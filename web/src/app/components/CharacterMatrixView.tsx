import { Character } from '@hero-ranker/shared/schemas/character';
import CharacterAvatar from './CharacterAvatar';

type CharacterMatrixViewProps = {
  characters: Character[];
};

const AVATAR_RADIUS = 40;

type CharacterGroup = {
  characters: Character[];
  karma: number;
  rating: number;
};

function getInsetPosition(value: number, offset = 0) {
  const pixelOffset = AVATAR_RADIUS * (1 - (2 * value) / 100) + offset;
  const operator = pixelOffset < 0 ? '-' : '+';

  return `calc(${value}% ${operator} ${Math.abs(pixelOffset)}px)`;
}

export default function CharacterMatrixView({
  characters,
}: CharacterMatrixViewProps) {
  const characterGroups = new Map<string, CharacterGroup>();
  for (const character of characters) {
    const karma = character.totalVotes > 0 ? character.karma : 50;
    const rating = character.rating;
    const key = `${karma}:${rating}`;
    const group = characterGroups.get(key);
    if (group) {
      group.characters.push(character);
    } else {
      characterGroups.set(key, { characters: [character], karma, rating });
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
                )
              `,
              backgroundSize: '100% 100%',
            }}
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
            >
              {Array.from({ length: 11 }, (_, index) => {
                const value = index * 10;

                return (
                  <div key={value}>
                    <span
                      className="absolute border-l-2 border-dotted border-white/40"
                      style={{
                        left: getInsetPosition(value),
                        top: AVATAR_RADIUS,
                        bottom: AVATAR_RADIUS,
                      }}
                    />
                    <span
                      className="absolute border-t-2 border-dotted border-white/40"
                      style={{
                        top: getInsetPosition(value),
                        left: AVATAR_RADIUS,
                        right: AVATAR_RADIUS,
                      }}
                    />
                  </div>
                );
              })}
            </div>
            {[...characterGroups.values()].map((group) => {
              const character = group.characters[0];

              return (
                <div
                  key={character.id}
                  className="absolute z-[1] -translate-x-1/2 hover:z-20 focus-within:z-20"
                  style={{
                    left: getInsetPosition(group.karma),
                    top: getInsetPosition(100 - group.rating, -AVATAR_RADIUS),
                  }}
                >
                  <div className="relative">
                    <CharacterAvatar character={character} />
                    {group.characters.length > 1 && (
                      <div className="absolute left-[88px] -top-3 flex flex-row -space-x-2">
                        {group.characters.slice(1).map((groupCharacter) => (
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
                  {100 - index * 10}%
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
