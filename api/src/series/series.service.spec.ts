import { NotFoundException } from '@nestjs/common';
import { SeriesService } from './series.service';

jest.mock('src/prisma/prisma.service', () => ({
  PrismaService: class PrismaService {},
}));

describe('SeriesService', () => {
  const prismaService = {
    series: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
    character: {
      findMany: jest.fn(),
    },
    $queryRaw: jest.fn(),
  };
  let service: SeriesService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new SeriesService(prismaService as never);
  });

  describe('getSeries', () => {
    it('returns up to ten series', async () => {
      const series = [{ id: 1, title: 'Series' }];
      prismaService.series.findMany.mockResolvedValue(series);

      await expect(service.getSeries()).resolves.toEqual(series);
      expect(prismaService.series.findMany).toHaveBeenCalledWith({ take: 10 });
    });
  });

  describe('getSeriesById', () => {
    it('returns a series with characters and seasons', async () => {
      const series = { id: 1, title: 'Series' };
      prismaService.series.findUnique.mockResolvedValue(series);

      await expect(service.getSeriesById(1)).resolves.toEqual(series);
      expect(prismaService.series.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: {
          characters: true,
          seasons: { include: { characters: true } },
        },
      });
    });

    it('throws when the series does not exist', async () => {
      prismaService.series.findUnique.mockResolvedValue(null);

      await expect(service.getSeriesById(99)).rejects.toThrow(
        new NotFoundException('Series with id 99 not found'),
      );
    });
  });

  describe('getCharactersBySeriesId', () => {
    it('returns characters using the requested sort and limit', async () => {
      const characters = [{ id: 1, name: 'Hero' }];
      prismaService.series.findUnique.mockResolvedValue({ id: 1 });
      prismaService.$queryRaw.mockResolvedValue([
        {
          id: 1,
          name: 'Hero',
          alternativeName: null,
          seriesId: 1,
          appearsInAllSeasons: true,
          totalVotes: 1,
          evilVotes: 0,
          points: 2,
          imageKey: null,
        },
      ]);

      await expect(
        service.getCharactersBySeriesId(1, {
          sortBy: 'RATING',
          karma: 'GOOD',
          season: 3,
          limit: 5,
        }),
      ).resolves.toEqual([
        {
          id: 1,
          name: 'Hero',
          alternativeName: null,
          seriesId: 1,
          appearsInAllSeasons: true,
          totalVotes: 1,
          evilVotes: 0,
          points: 2,
          imageKey: null,
        },
      ]);

      const query = prismaService.$queryRaw.mock.calls[0][0];
      expect(query.text).toContain('c."points"::numeric / c."totalVotes"');
      expect(query.text).toContain('c."totalVotes" DESC');
      expect(query.text).toContain('c."evilVotes"::numeric / c."totalVotes" < 0.25');
      expect(query.text).toContain('"_CharacterToSeason"');
      expect(query.text).toContain('c."appearsInAllSeasons" = true');
      expect(query.values).toEqual(expect.arrayContaining([1, 3, 5]));
      expect(prismaService.character.findMany).not.toHaveBeenCalled();
    });

    it('throws when the series does not exist', async () => {
      prismaService.series.findUnique.mockResolvedValue(null);

      await expect(service.getCharactersBySeriesId(99, {})).rejects.toThrow(
        new NotFoundException('Series with id 99 not found'),
      );
      expect(prismaService.$queryRaw).not.toHaveBeenCalled();
    });
  });
});
