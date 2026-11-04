import { NotFoundException } from '@nestjs/common';
import { CharactersService } from './characters.service';

jest.mock('src/prisma/prisma.service', () => ({
  PrismaService: class PrismaService {},
}));

describe('CharactersService', () => {
  const prismaService = {
    character: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
    vote: {
      findUnique: jest.fn(),
    },
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
      const characters = [{ id: 1, name: 'Hero' }];
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
      const character = { id: 1, name: 'Hero' };
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
      prismaService.character.findMany.mockResolvedValueOnce([]);

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
      expect(prismaService.character.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: { series: true, seasons: true },
      });
      expect(prismaService.vote.findUnique).toHaveBeenCalledWith({
        where: { characterId_userId: { characterId: 1, userId: 7 } },
      });
      expect(prismaService.character.findMany).toHaveBeenCalledWith({
        where: { rating: { gt: 75 } },
        select: { rating: true },
        distinct: ['rating'],
      });
    });

    it('returns a null vote for guests', async () => {
      const character = { id: 1, name: 'Hero' };
      prismaService.character.findUnique
        .mockResolvedValueOnce(character)
        .mockResolvedValueOnce({ rating: 75 });
      prismaService.character.findMany.mockResolvedValueOnce([{ rating: 90 }]);

      await expect(service.getCharacterById(1)).resolves.toEqual({
        ...character,
        rank: 2,
        vote: null,
      });
      expect(prismaService.vote.findUnique).not.toHaveBeenCalled();
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
