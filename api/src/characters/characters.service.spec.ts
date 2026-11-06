import { NotFoundException } from '@nestjs/common';
import { CharactersService } from './characters.service';

jest.mock('src/prisma/prisma.service', () => ({
  PrismaService: class PrismaService {},
}));

const createCharacter = (overrides = {}) => ({
  id: 1,
  name: 'Hero',
  alternativeName: null,
  seriesId: 2,
  appearsInAllSeasons: true,
  totalVotes: 1,
  evilVotes: 0,
  points: 2,
  imageKey: null,
  rating: 50,
  karma: 0,
  ...overrides,
});

describe('CharactersService', () => {
  const prismaService = {
    character: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
    vote: {
      findUnique: jest.fn(),
    },
    $queryRaw: jest.fn(),
  };
  let service: CharactersService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new CharactersService(
      prismaService as never,
      {} as never,
      {} as never,
    );
  });

  describe('getCharacters', () => {
    it('filters by name and series and orders by name', async () => {
      const characters = [createCharacter()];
      prismaService.character.findMany.mockResolvedValue(characters);

      await expect(
        service.getCharacters({ name: 'hero', seriesId: 2, limit: 10 }),
      ).resolves.toEqual(characters);
      expect(prismaService.character.findMany).toHaveBeenCalledWith({
        where: {
          name: { contains: 'hero', mode: 'insensitive' },
          seriesId: 2,
        },
        orderBy: { name: 'asc' },
        take: 10,
      });
    });
  });

  describe('getCharacterById', () => {
    it('returns a character with the current user vote', async () => {
      const character = { ...createCharacter(), ratingInfo: '' };
      const vote = {
        id: 3,
        characterId: 1,
        userId: 7,
        isEvil: true,
        points: 3,
        createdAt: new Date(),
      };
      prismaService.character.findUnique
        .mockResolvedValueOnce(character)
        .mockResolvedValueOnce({ rating: 75 });
      prismaService.vote.findUnique.mockResolvedValue(vote);
      prismaService.$queryRaw.mockResolvedValueOnce([{ count: 0n }]);

      await expect(service.getCharacterById(1, 7)).resolves.toEqual({
        ...character,
        rank: 1,
        vote: {
          id: 3,
          characterId: 1,
          userId: 7,
          isEvil: true,
          points: 3,
        },
      });
      expect(prismaService.character.findUnique).toHaveBeenNthCalledWith(1, {
        where: { id: 1 },
      });
      expect(prismaService.character.findUnique).toHaveBeenNthCalledWith(2, {
        where: { id: 1 },
        select: { rating: true },
      });
      expect(prismaService.vote.findUnique).toHaveBeenCalledWith({
        where: { characterId_userId: { characterId: 1, userId: 7 } },
      });
      expect(prismaService.$queryRaw).toHaveBeenCalled();
    });

    it('returns a null vote for guests', async () => {
      const character = { ...createCharacter(), ratingInfo: '' };
      prismaService.character.findUnique
        .mockResolvedValueOnce(character)
        .mockResolvedValueOnce({ rating: 75 });
      prismaService.$queryRaw.mockResolvedValueOnce([{ count: 1n }]);

      await expect(service.getCharacterById(1)).resolves.toEqual({
        ...character,
        rank: 2,
        vote: null,
      });
      expect(prismaService.vote.findUnique).not.toHaveBeenCalled();
      expect(prismaService.$queryRaw).toHaveBeenCalled();
    });

    it('throws when the character does not exist', async () => {
      prismaService.character.findUnique.mockResolvedValue(null);

      await expect(service.getCharacterById(99)).rejects.toThrow(
        new NotFoundException('Character with id 99 not found'),
      );
    });
  });

  describe('updateCharacterVoteStats', () => {
    it('updates aggregate vote stats and derived rating and karma atomically', async () => {
      const queries: { query: TemplateStringsArray; values: unknown[] }[] = [];
      const executeRaw = jest.fn(
        (query: TemplateStringsArray, ...values: unknown[]) => {
          queries.push({ query, values });
          return Promise.resolve(1);
        },
      );
      const tx = {
        $executeRaw: executeRaw,
      };

      await service.updateCharacterVoteStats(tx as never, 10, {
        totalVotes: 1,
        evilVotes: 1,
        points: 3,
      });

      const { query, values } = queries[0];
      const queryText = query.join('');
      expect(queryText).toContain('"rating" = CASE');
      expect(queryText).toContain('"karma" = CASE');
      expect(queryText).toContain('ROUND(');
      expect(values).toEqual(expect.arrayContaining([1, 10]));
    });
  });
});
