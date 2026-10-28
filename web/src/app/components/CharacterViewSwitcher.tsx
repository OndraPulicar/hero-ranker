import type { CharacterView } from './Characters';

type CharacterViewSwitcherProps = {
  view: CharacterView;
  onChange: (view: CharacterView) => void;
};

const views: { value: CharacterView; label: string }[] = [
  { value: 'list', label: 'List' },
  { value: 'matrix', label: 'Matrix' },
];

export default function CharacterViewSwitcher({
  view,
  onChange,
}: CharacterViewSwitcherProps) {
  return (
    <div
      className="flex w-fit rounded-lg border border-[#3b3e4b] bg-[#232631] p-1"
      role="group"
      aria-label="Character view"
    >
      {views.map(({ value, label }) => (
        <button
          key={value}
          type="button"
          aria-pressed={view === value}
          onClick={() => onChange(value)}
          className={`rounded-md px-4 py-2 text-sm font-semibold cursor-pointer transition-colors ${
            view === value
              ? 'bg-[#D90429] text-white'
              : 'text-gray-300 hover:text-white'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
