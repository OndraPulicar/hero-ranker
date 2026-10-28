export default function CharacterMatrixView() {
  return (
    <section>
      <h3 className="mb-2 text-lg font-bold">Character matrix</h3>
      <div className="flex gap-2">
        <span className="self-stretch text-center text-[11px] font-bold tracking-wider text-gray-400 uppercase [writing-mode:vertical-rl] rotate-180">
          Rating
        </span>
        <div className="ml-6 flex-1">
          <div
            aria-label="Character matrix: rating runs from 0 at the bottom to 10 at the top; karma runs from 100 percent good on the left through 0 in the middle to 100 percent evil on the right"
            className="relative aspect-[4/3] w-full"
            role="img"
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
