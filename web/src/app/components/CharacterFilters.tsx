import { CharacterFilter } from '@/types/character';
import { Season } from '@hero-ranker/shared/schemas/season';
import { ChevronDown } from 'lucide-react';

type CharacterFiltersProps = {
  filters: CharacterFilter;
  setFilters: React.Dispatch<React.SetStateAction<CharacterFilter>>;
  seasons: Season[];
};

export default function CharacterFilters({
  filters,
  setFilters,
  seasons,
}: CharacterFiltersProps) {
  return (
    <section>
      <h3 className="text-lg font-bold mb-2">Filters</h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="flex flex-col gap-2">
          <label
            htmlFor="season-filter"
            className="text-sm font-semibold text-[#edddd4]"
          >
            Season
          </label>

          <div className="relative">
            <select
              id="season-filter"
              value={filters.season}
              onChange={(event) =>
                setFilters((prev) => ({
                  ...prev,
                  season:
                    event.target.value === 'ALL'
                      ? 'ALL'
                      : Number(event.target.value),
                }))
              }
              className="w-full appearance-none rounded-lg border border-[#3b3e4b] bg-[#232631] px-3 py-2.5 text-sm text-white outline-none transition-colors hover:border-[#8d99ae] focus:border-[#D90429] focus:ring-2 focus:ring-[#D90429]/20"
            >
              <option value="ALL">All seasons</option>

              {seasons.map((season) => (
                <option key={season.id} value={season.id}>
                  {season.alternativeTitle ?? `Season ${season.seasonNumber}`}
                </option>
              ))}
            </select>
            <ChevronDown
              aria-hidden="true"
              className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-white"
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label
            htmlFor="karma-filter"
            className="text-sm font-semibold text-[#edddd4]"
          >
            Karma
          </label>

          <div className="relative">
            <select
              id="karma-filter"
              value={filters.karma}
              onChange={(event) =>
                setFilters((prev) => ({
                  ...prev,
                  karma: event.target.value as CharacterFilter['karma'],
                }))
              }
              className="w-full appearance-none rounded-lg border border-[#3b3e4b] bg-[#232631] px-3 py-2.5 text-sm text-white outline-none transition-colors hover:border-[#8d99ae] focus:border-[#D90429] focus:ring-2 focus:ring-[#D90429]/20"
            >
              <option value="ALL">All karma</option>
              <option value="GOOD">Good</option>
              <option value="NEUTRAL">Neutral</option>
              <option value="EVIL">Evil</option>
            </select>
            <ChevronDown
              aria-hidden="true"
              className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-white"
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label
            htmlFor="sort-filter"
            className="text-sm font-semibold text-[#edddd4]"
          >
            Sort by
          </label>

          <div className="relative">
            <select
              id="sort-filter"
              value={filters.sort}
              onChange={(event) =>
                setFilters((prev) => ({
                  ...prev,
                  sort: event.target.value as CharacterFilter['sort'],
                }))
              }
              className="w-full appearance-none rounded-lg border border-[#3b3e4b] bg-[#232631] px-3 py-2.5 text-sm text-white outline-none transition-colors hover:border-[#8d99ae] focus:border-[#D90429] focus:ring-2 focus:ring-[#D90429]/20"
            >
              <option value="RATING">Rating</option>
              <option value="NAME">Name</option>
              <option value="KARMA">Karma (good &gt; bad)</option>
            </select>
            <ChevronDown
              aria-hidden="true"
              className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-white"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
