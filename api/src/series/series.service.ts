import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetCharactersBySeriesIdDto } from './dto/get-characters-by-series-id.dto';
import { CreateSeriesDto } from './dto/create-series.dto';
import { Prisma } from 'generated/prisma/client';
import { StorageService } from 'src/storage/storage.service';
import { UpdateSeriesDto } from './dto/update-series.dto';
import {
  Series,
  SeriesDetailSchema,
  SeriesSchema,
} from '@hero-ranker/shared/schemas/series';
import { CharacterSchema } from '@hero-ranker/shared/schemas/character';

const sortByMap = {
  RATING:
    'CASE WHEN c."totalVotes" > 0 THEN c."points"::numeric / c."totalVotes" ELSE 0 END DESC, c."totalVotes" DESC',
  NAME: 'c."name" ASC',
  KARMA:
    'CASE WHEN c."totalVotes" > 0 THEN c."evilVotes"::numeric / c."totalVotes" ELSE 0 END ASC',
} as const;

const karmaFilterMap = {
  GOOD: 'c."totalVotes" > 0 AND c."evilVotes"::numeric / c."totalVotes" < 0.25',
  NEUTRAL:
    'c."totalVotes" > 0 AND c."evilVotes"::numeric / c."totalVotes" BETWEEN 0.25 AND 0.75',
  EVIL: 'c."totalVotes" > 0 AND c."evilVotes"::numeric / c."totalVotes" > 0.75',
} as const;

@Injectable()
export class SeriesService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly storageService: StorageService,
  ) {}

  getSeries() {
    return this.prismaService.series
      .findMany({
        take: 10,
      })
      .then((series) => SeriesSchema.array().parse(series));
  }

  async getSeriesById(id: number) {
    const series = await this.prismaService.series.findUnique({
      where: {
        id: id,
      },
      include: {
        seasons: {
          include: {
            characters: true,
          },
        },
      },
    });

    if (!series) {
      throw new NotFoundException(`Series with id ${id} not found`);
    }

    return SeriesDetailSchema.parse(series);
  }

  async getCharactersBySeriesId(id: number, query: GetCharactersBySeriesIdDto) {
    const series = await this.prismaService.series.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
      },
    });

    if (!series) {
      throw new NotFoundException(`Series with id ${id} not found`);
    }

    const orderBy = query.sortBy
      ? Prisma.raw(sortByMap[query.sortBy])
      : Prisma.raw('c."id" ASC');
    const karmaFilter = query.karma
      ? Prisma.raw(karmaFilterMap[query.karma])
      : Prisma.empty;

    const characters = await this.prismaService.$queryRaw<
      Prisma.CharacterGetPayload<object>[]
    >`
      SELECT c.*
      FROM "Character" c
      WHERE c."seriesId" = ${id}
      ${
        query.season !== undefined
          ? Prisma.sql`
            AND (
              c."appearsInAllSeasons" = true
              OR EXISTS (
                SELECT 1
                FROM "_CharacterToSeason" cs
                JOIN "Season" s ON s.id = cs."B"
                WHERE cs."A" = c.id
                  AND cs."B" = ${query.season}
                  AND s."seriesId" = ${id}
              )
            )
          `
          : Prisma.empty
      }
      ${query.karma ? Prisma.sql`AND ${karmaFilter}` : Prisma.empty}
      ORDER BY ${orderBy}
      ${query.limit !== undefined ? Prisma.sql`LIMIT ${query.limit}` : Prisma.empty}
    `;

    return CharacterSchema.array().parse(characters);
  }

  async createSeries(dto: CreateSeriesDto, file?: Express.Multer.File) {
    const data: Prisma.SeriesCreateInput = {
      title: dto.title,
      yearOfProduction: dto.yearOfProduction,
      isLimited: dto.isLimited,
      description: dto.description,
    };

    if (dto.seasons !== undefined) {
      data.seasons = {
        create: dto.seasons,
      };
    }

    const series = await this.prismaService.series.create({ data });

    if (file) {
      return SeriesSchema.parse(
        await this.uploadSeriesImageAndUpdate(series, file),
      );
    }

    return SeriesSchema.parse(series);
  }

  async updateSeries(
    id: number,
    dto: UpdateSeriesDto,
    file?: Express.Multer.File,
  ) {
    const series = await this.prismaService.series.update({
      where: { id },
      data: dto,
    });

    if (file) {
      return SeriesSchema.parse(
        await this.uploadSeriesImageAndUpdate(series, file),
      );
    }

    return SeriesSchema.parse(series);
  }

  private async uploadSeriesImageAndUpdate(
    series: Series,
    file: Express.Multer.File,
  ) {
    const imageKey = this.storageService.createImageKey(series.id, 'series');

    try {
      await this.storageService.upload(file.buffer, imageKey, file.mimetype);
      return SeriesSchema.parse(
        await this.prismaService.series.update({
          where: { id: series.id },
          data: { imageKey },
        }),
      );
    } catch (error) {
      this.logger.error(
        `Failed to upload image for series ${series.id}`,
        error,
      );
      return SeriesSchema.parse(series);
    }
  }

  async deleteSeries(id: number) {
    return SeriesSchema.parse(
      await this.prismaService.series.delete({ where: { id } }),
    );
  }

  private readonly logger = new Logger(SeriesService.name);
}
