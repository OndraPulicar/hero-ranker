import Image from 'next/image';
import { PencilSparkles } from 'lucide-react';

export default function Character() {
  return (
    <div className="mx-auto w-full max-w-3xl bg-[#0d1017] p-4 text-white font-sans md:p-6">
      <div className="flex flex-col gap-6 md:flex-row md:items-stretch">
        <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden rounded-2xl md:w-72 md:aspect-[4/5]">
          <Image
            src="/images/characters/walter-white.jpg"
            alt="Walter White"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30" />

          <div className="absolute left-4 top-4 rounded-full bg-black/50 px-3 py-1 text-xs font-semibold backdrop-blur-md">
            #175
          </div>

          <div className="absolute bottom-4 left-4 right-4">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-500/90">
              Character Rating
            </span>
            <h2 className="text-2xl font-black leading-tight text-white md:text-3xl">
              Walter White
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
                Exceptional standing
              </p>
            </div>

            <div className="flex items-baseline rounded-2xl bg-[#facc15] px-4 py-3 text-black">
              <span className="text-3xl font-black md:text-4xl">
                97.5
              </span>
              <span className="ml-1 text-xs font-bold opacity-75">
                /100
              </span>
            </div>
          </div>

          <div className="my-6">
            <div className="relative mb-1 mt-6">
              <div 
                className="absolute bottom-full mb-1 flex -translate-x-1/2 flex-col items-center"
                style={{ left: '87%' }}
              >
                <span className="text-[11px] font-semibold text-gray-400">
                  87%
                </span>
                <span className="text-xs text-gray-400 leading-none">▼</span>
              </div>

              <div className="h-2 w-full rounded-full bg-gradient-to-r from-blue-500 via-rose-300 to-red-600" />
            </div>

            <div className="flex justify-between text-[11px] font-bold tracking-wider text-gray-400">
              <span>GOOD</span>
              <span>NEUTRAL</span>
              <span>EVIL</span>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center">
            <button className="group flex flex-col items-center justify-center gap-1 rounded-2xl bg-gray-800/80 p-3.5 text-gray-200 transition-all hover:bg-gray-700/80 hover:scale-105 active:scale-95 cursor-pointer">
              <PencilSparkles className="h-6 w-6 text-gray-300 transition-transform group-hover:rotate-12" />
            </button>
            <span className="mt-2 text-[10px] font-bold tracking-widest text-gray-400 uppercase">
              Vote Now!
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}