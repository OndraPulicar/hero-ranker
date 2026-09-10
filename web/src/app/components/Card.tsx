import Image from "next/image";
import Link from "next/link";

export default function Card({ data }: { data: { id: number; title: string; imageUrl: string; slug: string } }) {
  return (
    <Link href={`/${data.slug}/${data.id}`}>
      <div className="text-text dark:text-background bg-muted rounded-lg shadow-md flex flex-col items-center gap-2">
        <Image
          className="rounded-t-lg w-full h-65 object-cover"
          src={`/images/${data.slug}/${data.imageUrl}`}
          alt={data.title}
          width={150}
          height={150}
        />
        <span className="pb-4 pt-2">{data.title}</span>
      </div>
    </Link>
  );
}
