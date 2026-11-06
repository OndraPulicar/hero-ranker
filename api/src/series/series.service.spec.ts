import { NotFoundException } from '@nestjs/common';
import { SeriesService } from './series.service';

type SqlFragment = { text: string; values: unknown[] };

jest.mock('src/prisma/prisma.service', () => ({
  PrismaService: class PrismaService {},
}));

jest.mock('generated/prisma/client', () => {
  const createSql = (
    strings: TemplateStringsArray,
    ...interpolations: unknown[]
  ): SqlFragment => {
    let text = strings[0];
    const values: unknown[] = [];

    interpolations.forEach((interpolation, index) => {
      if (
        typeof interpolation === 'object' &&
        interpolation !== null &&
        'text' in interpolation &&
        'values' in interpolation
      ) {
        const fragment = interpolation as SqlFragment;
        text += fragment.text;
        values.push(...fragment.values);
      } else {
        values.push(interpolation);
        text += `$${values.length}`;
      }

      text += strings[index + 1];
    });

    return { text, values };
  };

  return {
    Prisma: {
      empty: { text: '', values: [] },
      raw: (text: string): SqlFragment => ({ text, values: [] }),
      sql: createSql,
    },
  };
});

jest.mock('@hero-ranker/shared/schemas/series', () => ({
  SeriesSchema: {
    array: () => ({ parse: (value: unknown) => value }),
    parse: (value: unknown) => value,
  },
  SeriesDetailSchema: {
    parse: (value: unknown) => value,
  },
}));

jest.mock('@hero-ranker/shared/schemas/character', () => ({
  CharacterSchema: {
    array: () => ({ parse: (value: unknown) => value }),
  },
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
  const storageService = {};
  let service: SeriesService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new SeriesService(
      prismaService as never,
      storageService as never,
    );
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

      const queryCalls = prismaService.$queryRaw.mock.calls as unknown as [
        TemplateStringsArray,
        ...unknown[],
      ][];
      const [template, ...interpolations] = queryCalls[0];
      const queryText = template.reduce((text, part, index) => {
        const interpolation = interpolations[index];
        const nestedText =
          typeof interpolation === 'object' &&
          interpolation !== null &&
          'text' in interpolation
            ? String(interpolation.text)
            : '';

        return text + part + nestedText;
      }, '');
      const queryValues = interpolations.flatMap((interpolation) =>
        typeof interpolation === 'object' &&
        interpolation !== null &&
        'values' in interpolation
          ? interpolation.values
          : [interpolation],
      );

      expect(queryText).toContain('c."points"::numeric / c."totalVotes"');
      expect(queryText).toContain('c."totalVotes" DESC');
      expect(queryText).toContain(
        'c."evilVotes"::numeric / c."totalVotes" < 0.25',
      );
      expect(queryText).toContain('"_CharacterToSeason"');
      expect(queryText).toContain('c."appearsInAllSeasons" = true');
      expect(queryValues).toEqual(expect.arrayContaining([1, 3, 5]));
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
