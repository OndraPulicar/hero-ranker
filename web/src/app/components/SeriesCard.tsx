import Image from "next/image";
import Link from "next/link";

export default function SeriesCard({ series }: { series: { id: number; name: string; imageUrl: string } }) {
  return (
    <Link href={`/series/${series.id}`}>
      <div className="text-black bg-white p-4 rounded-lg shadow-md flex flex-col items-center gap-2">
        <Image
          className="rounded-lg w-full h-65 object-cover"
          src={`/images/series/${series.imageUrl}`}
          alt={series.name}
          width={150}
          height={150}
        />
        <span>{series.name}</span>
      </div>
    </Link>
  );
}
