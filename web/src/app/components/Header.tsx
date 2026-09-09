export default function Header() {

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-gray-800 text-white">
      <section className="">
        <span className="text-xl font-bold">HeroRanker</span>
      </section>
      <section className="flex gap-2">
        <input
          className="w-80 px-4 py-1 rounded-full text-black bg-white" 
          type="text" 
          placeholder="Search..." 
        />
        <button
          className="px-4 py-1 rounded-full bg-blue-500 hover:bg-blue-600 text-white"
          type="submit"
        >
          Search
        </button>
      </section>
    </header>
  );
}