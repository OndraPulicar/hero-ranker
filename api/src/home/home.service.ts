import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class HomeService {
  constructor(private readonly prismaService: PrismaService) {}

  async getHome() {
    const [topSeries, topCharacters] = await Promise.all([
      this.getTopSeries(),
      this.getTopCharacters(),
    ]);

    return {
      topSeries,
      topCharacters,
    };
  }

  private getTopCharacters() {
    return this.prismaService.character.findMany({
      orderBy: {
        totalVotes: 'desc',
      },
      take: 5,
      select: {
        id: true,
        name: true,
        imageKey: true,
        totalVotes: true,
      },
    });
  }

  private getTopSeries() {
    return this.prismaService.$queryRaw<
      {
        id: number;
        title: string;
        imageKey: string | null;
        totalVotes: number;
      }[]
    >`
    SELECT
      s.id,
      s.title,
      s."imageKey",
      CAST(COALESCE(SUM(c."totalVotes"), 0) AS INTEGER) AS "totalVotes"
    FROM "Series" s
    LEFT JOIN "Character" c
      ON c."seriesId" = s.id
    GROUP BY s.id, s.title, s."imageKey"
    ORDER BY "totalVotes" DESC
    LIMIT 5
  `;
  }
}
