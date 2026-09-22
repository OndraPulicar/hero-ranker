import 'dotenv/config';
import { PrismaClient } from '../generated/prisma/client';

const prisma = new PrismaClient();

const serialSequenceTables = [
  'Series',
  'Season',
  'Character',
  'User',
  'Vote',
] as const;

async function synchronizeAutoIncrementSequences() {
  for (const tableName of serialSequenceTables) {
    await prisma.$executeRawUnsafe(
      `SELECT setval(pg_get_serial_sequence('"${tableName}"', 'id'), COALESCE((SELECT MAX(id) FROM "${tableName}"), 1), true)`,
    );
  }
}

async function main() {
  await prisma.vote.deleteMany();
  await prisma.character.deleteMany();
  await prisma.season.deleteMany();
  await prisma.user.deleteMany();
  await prisma.series.deleteMany();

  const series = await prisma.series.create({
    data: {
      id: 1,
      title: 'The Test Series',
      yearOfProduction: 2024,
      isLimited: false,
    },
  });

  await prisma.season.createMany({
    data: [
      {
        id: 1,
        seasonNumber: 1,
        alternativeTitle: 'Origins',
        seriesId: series.id,
      },
      {
        id: 2,
        seasonNumber: 2,
        alternativeTitle: 'Return',
        seriesId: series.id,
      },
    ],
  });

  await prisma.character.createMany({
    data: [
      {
        id: 1,
        name: 'Alpha Hero',
        alternativeName: 'The Alpha',
        seriesId: series.id,
        appearsInAllSeasons: true,
        totalVotes: 1,
        evilVotes: 0,
        points: 2,
      },
      {
        id: 2,
        name: 'Beta Villain',
        alternativeName: 'The Beta',
        seriesId: series.id,
        appearsInAllSeasons: false,
      },
    ],
  });

  await prisma.character.update({
    where: { id: 1 },
    data: { seasons: { connect: [{ id: 1 }, { id: 2 }] } },
  });
  await prisma.character.update({
    where: { id: 2 },
    data: { seasons: { connect: [{ id: 2 }] } },
  });

  await prisma.user.createMany({
    data: [
      {
        id: 1,
        username: 'test-user',
        email: 'test@example.com',
        passwordHash: 'xxx',
      },
      {
        id: 2,
        username: 'second-user',
        email: 'second@example.com',
        passwordHash: 'yyy',
      },
    ],
  });

  await prisma.vote.create({
    data: {
      id: 1,
      characterId: 1,
      userId: 1,
      isEvil: false,
      points: 2,
    },
  });

  await synchronizeAutoIncrementSequences();

  console.log(`Seeded e2e database with series ${series.id}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
