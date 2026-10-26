import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SearchResultSchema } from '@hero-ranker/shared/schemas/search';

@Injectable()
export class SearchService {
  constructor(private readonly prismaService: PrismaService) {}

  async search(query: string) {
    const [characters, series] = await Promise.all([
      this.prismaService.character.findMany({
        where: {
          OR: [
            {
              name: {
                contains: query,
                mode: 'insensitive',
              },
            },
            {
              alternativeName: {
                contains: query,
                mode: 'insensitive',
              },
            },
          ],
        },
        select: {
          id: true,
          name: true,
          imageKey: true,
          series: {
            select: {
              title: true,
            },
          },
        },
      }),
      this.prismaService.series.findMany({
        where: {
          title: {
            contains: query,
            mode: 'insensitive',
          },
        },
        select: {
          id: true,
          title: true,
          imageKey: true,
          yearOfProduction: true,
        },
      }),
    ]);

    return SearchResultSchema.parse({
      characters,
      series,
    });
  }
}
