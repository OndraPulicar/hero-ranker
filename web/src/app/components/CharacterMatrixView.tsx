import { Character } from '@hero-ranker/shared/schemas/character';
import CharacterAvatar from './CharacterAvatar';

type CharacterMatrixViewProps = {
  characters: Character[];
};

export default function CharacterMatrixView({
  characters,
}: CharacterMatrixViewProps) {
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
            {characters.map((character) => {
              const hasVotes = character.totalVotes > 0;
              const karma = hasVotes
                ? (character.evilVotes / character.totalVotes) * 100
                : 50;
              const rating = hasVotes
                ? (character.points / character.totalVotes / 3) * 10
                : 0;
              const jitterX = ((character.id * 17) % 41) - 20;
              const jitterY = ((character.id * 29) % 41) - 20;

              return (
                <div
                  key={character.id}
                  className="absolute z-[1] -translate-x-1/2 -translate-y-1/2 hover:z-20 focus-within:z-20"
                  style={{
                    left: `calc(${karma}% + ${jitterX}px)`,
                    top: `calc(${100 - rating * 10}% + ${jitterY}px)`,
                  }}
                >
                  <CharacterAvatar character={character} />
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
                    top: `${index * 10}%`,
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
          <div className="mt-2 flex justify-between text-[11px] font-bold tracking-wider text-gray-400 uppercase">
            <span>100% Good</span>
            <span>Neutral</span>
            <span>Evil 100%</span>
          </div>
          <div className="mt-2 text-center text-[11px] font-bold tracking-wider text-gray-400 uppercase">
            Karma
          </div>
        </div>
      </div>
    </section>
  );
}
