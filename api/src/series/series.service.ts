import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetCharactersBySeriesIdDto } from './dto/get-characters-by-series-id.dto';
import { CreateSeriesDto } from './dto/create-series.dto';
import { Prisma } from 'generated/prisma/client';
import { StorageService } from 'src/storage/storage.service';
import { UpdateSeriesDto } from './dto/update-series.dto';

@Injectable()
export class SeriesService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly storageService: StorageService,
  ) {}

  getSeries() {
    return this.prismaService.series.findMany({
      take: 10,
    });
  }

  async getSeriesById(id: number) {
    const series = await this.prismaService.series.findUnique({
      where: {
        id: id,
      },
      include: {
        characters: true,
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

    return series;
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

    return this.prismaService.character.findMany({
      where: {
        seriesId: id,
      },
      orderBy: query.sortBy ? { [query.sortBy]: 'asc' } : undefined,
      take: query.limit,
    });
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
      return this.uploadSeriesImageAndUpdate(series.id, file);
    }

    return series;
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
      return this.uploadSeriesImageAndUpdate(id, file);
    }

    return series;
  }

  private async uploadSeriesImageAndUpdate(
    id: number,
    file: Express.Multer.File,
  ) {
    const imageKey = this.storageService.createImageKey(id, 'series');

    try {
      await this.storageService.upload(file.buffer, imageKey, file.mimetype);
      return this.prismaService.series.update({
        where: { id },
        data: { imageKey },
      });
    } catch (error) {
      this.logger.error(`Failed to upload image for series ${id}`, error);
    }
  }

  async deleteSeries(id: number) {
    return this.prismaService.series.delete({ where: { id } });
  }

  private readonly logger = new Logger(SeriesService.name);
}
