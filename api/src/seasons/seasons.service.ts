import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSeasonDto } from './dto/create-season.dto';
import { UpdateSeasonDto } from './dto/update-season.dto';
import { ConflictException, Injectable } from '@nestjs/common';
import { SeasonSchema } from '@hero-ranker/shared/schemas/season';
import { z } from 'zod';

@Injectable()
export class SeasonsService {
  constructor(private readonly prismaService: PrismaService) {}

  async createSeason(seriesId: number, dto: CreateSeasonDto) {
    return SeasonSchema.parse(
      await this.prismaService.season.create({
        data: { ...dto, seriesId },
      }),
    );
  }

  async updateSeason(id: number, dto: UpdateSeasonDto) {
    return SeasonSchema.parse(
      await this.prismaService.season.update({
        where: { id },
        data: dto,
      }),
    );
  }

  async deleteSeason(id: number) {
    const characters = z.array(SeasonSchema).parse(
      await this.prismaService.character.findMany({
        where: { seasons: { some: { id } } },
        select: { id: true },
      }),
    );

    if (characters.length > 0) {
      throw new ConflictException(
        `Cannot delete season (ID: ${id}) because it has associated characters (ID: ${characters.map((character) => character.id).join(', ')})`,
      );
    }
  }
}
