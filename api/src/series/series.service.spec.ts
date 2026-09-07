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
      prismaService.character.findMany.mockResolvedValue(characters);

      await expect(
        service.getCharactersBySeriesId(1, { sortBy: 'name', limit: 5 }),
      ).resolves.toEqual(characters);
      expect(prismaService.character.findMany).toHaveBeenCalledWith({
        where: { seriesId: 1 },
        orderBy: { name: 'asc' },
        take: 5,
      });
    });

    it('throws when the series does not exist', async () => {
      prismaService.series.findUnique.mockResolvedValue(null);

      await expect(service.getCharactersBySeriesId(99, {})).rejects.toThrow(
        new NotFoundException('Series with id 99 not found'),
      );
      expect(prismaService.character.findMany).not.toHaveBeenCalled();
    });
  });
});
