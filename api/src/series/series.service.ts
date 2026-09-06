import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetCharactersBySeriesIdDto } from './dto/get-characters-by-series-id.dto';

@Injectable()
export class SeriesService {
  constructor(private readonly prismaService: PrismaService) {}

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
}
