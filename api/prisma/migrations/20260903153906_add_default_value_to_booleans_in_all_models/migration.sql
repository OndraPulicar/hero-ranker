-- AlterTable
ALTER TABLE "Character" ALTER COLUMN "appearsInAllSeasons" SET DEFAULT true;

-- AlterTable
ALTER TABLE "Series" ALTER COLUMN "isLimited" SET DEFAULT false;

-- AlterTable
ALTER TABLE "Vote" ALTER COLUMN "isEvil" SET DEFAULT false;
