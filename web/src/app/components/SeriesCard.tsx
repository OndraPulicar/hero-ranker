import Image from "next/image";
import Link from "next/link";

export default function SeriesCard({ series }: { series: { id: number; name: string; imageUrl: string } }) {
  return (
    <Link href={`/series/${series.id}`}>
      <div className="text-text dark:text-background bg-muted rounded-lg shadow-md flex flex-col items-center gap-2">
        <Image
          className="rounded-t-lg w-full h-65 object-cover"
          src={`/images/series/${series.imageUrl}`}
          alt={series.name}
          width={150}
          height={150}
        />
        <span className="pb-4 pt-2">{series.name}</span>
      </div>
    </Link>
  );
}
