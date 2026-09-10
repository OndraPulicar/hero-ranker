import Image from "next/image";
import Link from "next/link";

export default function Card({ data }: { data: { id: number; title: string; imageUrl: string; resource: "series" | "characters" } }) {
  return (
    <Link
      className="hover:-translate-y-2 hover:shadow-xl hover:dark:shadow-white/15 transition text-text dark:text-background bg-muted rounded-lg shadow-md flex flex-col items-center gap-2"
      href={`/${data.resource}/${data.id}`}
    >
        <Image
          className="rounded-t-lg w-full h-65 object-cover"
          src={`/images/${data.resource}/${data.imageUrl}`}
          alt={data.title}
          width={150}
          height={150}
        />
        <span className="pb-4 pt-2">{data.title}</span>
    </Link>
  );
}
