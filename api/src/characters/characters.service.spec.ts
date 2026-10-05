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
    service = new CharactersService(prismaService as never, {} as never);
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
      prismaService.character.findUnique.mockResolvedValue(character);
      prismaService.vote.findUnique.mockResolvedValue(vote);

      await expect(service.getCharacterById(1, 7)).resolves.toEqual({
        ...character,
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
    });

    it('returns a null vote for guests', async () => {
      const character = { id: 1, name: 'Hero' };
      prismaService.character.findUnique.mockResolvedValue(character);

      await expect(service.getCharacterById(1)).resolves.toEqual({
        ...character,
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
});
