import Image from "next/image";

export default function CharacterCard({ character }: { character: { id: number; name: string; imageUrl: string } }) {
  return (
    <div className="text-black bg-white p-4 rounded-lg shadow-md flex flex-col items-center gap-2">
      <Image
        className="rounded-lg w-full h-65 object-cover"
        src={`/images/characters/${character.imageUrl}`}
        alt={character.name}
        width={150}
        height={150}
      />
      <span>{character.name}</span>
    </div>
  );
}
