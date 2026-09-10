import Card from "@/app/components/Card";
import Image from "next/image";

export default async function Series({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  console.log("series id:", id);
  return (
    <div className="flex flex-col gap-4 w-full mx-auto max-w-7xl px-6 py-10">
      <section className="">
        <h1 className="text-2xl font-bold mb-2">Breaking Bad </h1>
        <h2 className="text-lg font-bold mb-2">
          2006
        </h2>
      </section>
      <section className="flex flex-row gap-4">
        <Image
          src={`/images/series/breaking-bad.jpg`}
          alt="Breaking Bad"
          width={150}
          height={150}
        />
        <div className="max-w-xl text-justify">A chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine with a former student to secure his family&apos;s future.</div>
      </section>
      <section>
        <h3 className="text-lg font-bold mb-2">
          Seasons
        </h3>
        <span className="pr-4">Season 1</span>
        <span className="pr-4">Season 2</span>
        <span className="pr-4">Season 3</span>
        <span className="pr-4">Season 4</span>
        <span className="pr-4">Season 5</span>
      </section>
      <section>
        <h3 className="text-lg font-bold mb-2">
          Characters
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <Card data={{ id: 1, resource: "characters", title: "Walter White", imageUrl: "walter-white.jpg" }} />
          <Card data={{ id: 2, resource: "characters", title: "Jesse Pinkman", imageUrl: "jesse-pinkman.jpg" }} />
        </div>
      </section>
    </div>
  );
}