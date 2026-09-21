'use client';

type CharacterRatingModalProps = {
  onSubmit: (isEvil: boolean, points: number) => void;
};

export default function CharacterRatingModal({
  onSubmit,
}: CharacterRatingModalProps) {
  console.log(onSubmit);
  return <div>Rating Modal</div>;
}
