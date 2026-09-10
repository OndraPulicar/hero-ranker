export default function Header() {

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-muted text-background">
      <section className="">
        <span className="text-xl font-bold text-background">HeroRanker</span>
      </section>
      <section className="flex gap-2">
        <input
          className="w-80 px-4 py-1 rounded-full text-text bg-background outline-none" 
          type="text" 
          placeholder="Search..." 
        />
        <button
          className="px-4 py-1 rounded-full bg-primary hover:bg-surface text-text"
          type="submit"
        >
          Search
        </button>
      </section>
    </header>
  );
}