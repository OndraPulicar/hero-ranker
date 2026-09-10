import Image from "next/image";

export default function Card({ character }: { character: { id: number; name: string; imageUrl: string } }) {
  return (
    <div className="text-text dark:text-background bg-muted rounded-lg shadow-md flex flex-col items-center gap-2">
      <Image
        className="rounded-t-lg w-full h-65 object-cover"
        src={`/images/characters/${character.imageUrl}`}
        alt={character.name}
        width={150}
        height={150}
      />
      <span className="pb-4 pt-2">{character.name}</span>
    </div>
  );
}
