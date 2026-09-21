'use client';

import { useState } from 'react';

type CharacterRatingModalProps = {
  onSubmit: (isEvil: boolean, points: number) => void;
  onClose: () => void;
};

export default function CharacterRatingModal({
  onSubmit,
  onClose,
}: CharacterRatingModalProps) {
  const [isEvil, setIsEvil] = useState<boolean | undefined>(undefined);
  const [points, setPoints] = useState<1 | 2 | 3 | undefined>(undefined);
  const [step, setStep] = useState<1 | 2>(1);

  const rateEvil = (isEvil: boolean) => {
    setIsEvil(isEvil);
    setStep(2);
  };

  const ratePoints = (points: 1 | 2 | 3) => {
    onSubmit(isEvil!, points);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 text-black">
      <div className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
        {step === 1 && (
          <div className="flex-row items-center justify-center py-4">
            <div className="text-center py-4">Is this character evil?</div>
            <div className="flex gap-4">
              <button
                className="flex-1 p-2 border-1 border-black rounded-xl shadow-xl"
                onClick={() => {
                  rateEvil(false);
                }}
              >
                NO
              </button>
              <button
                className="flex-1 p-2 border-1 border-black rounded-xl shadow-xl"
                onClick={() => {
                  rateEvil(true);
                }}
              >
                YES
              </button>
            </div>
          </div>
        )}
        {step === 2 && (
          <div className="flex-row items-center justify-center py-4">
            <div className="text-center py-4">
              How do you like this character?
            </div>
            <div className="flex gap-4">
              <button
                className="flex-1 p-2 border-1 border-black rounded-xl shadow-xl"
                onClick={() => {
                  ratePoints(1);
                }}
              >
                I hate them!
              </button>
              <button
                className="flex-1 p-2 border-1 border-black rounded-xl shadow-xl"
                onClick={() => {
                  ratePoints(2);
                }}
              >
                Meh.
              </button>
              <button
                className="flex-1 p-2 border-1 border-black rounded-xl shadow-xl"
                onClick={() => {
                  ratePoints(3);
                }}
              >
                I love them!
              </button>
            </div>
          </div>
        )}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4"
        >
          ×
        </button>
      </div>
    </div>
  );
}
