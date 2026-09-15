import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetCharactersDto } from './dto/get-characters.dto';
import { UpdateCharactersDto } from './dto/update-character.dto';
import { Prisma } from 'generated/prisma/client';

@Injectable()
export class CharactersService {
  constructor(private readonly prismaService: PrismaService) {}

  getCharacters(query: GetCharactersDto) {
    return this.prismaService.character.findMany({
      where: {
        name: query.name
          ? { contains: query.name, mode: 'insensitive' }
          : undefined,
        seriesId: query.seriesId,
      },
      orderBy: { name: 'asc' },
      take: query.limit,
    });
  }

  async getCharacterById(id: number) {
    const character = await this.prismaService.character.findUnique({
      where: { id },
      include: {
        series: true,
        seasons: true,
      },
    });

    if (!character) {
      throw new NotFoundException(`Character with id ${id} not found`);
    }

    return character;
  }

  async updateCharacter(id: number, dto: UpdateCharactersDto) {
    const data: Prisma.CharacterUpdateInput = {
      name: dto.name,
      alternativeName: dto.alternativeName,
      appearsInAllSeasons: dto.appearsInAllSeasons,
      imageKey: dto.imageKey,
    };

    if (dto.seasons !== undefined) {
      data.seasons = {
        set: dto.seasons.map((seasonId) => ({
          id: seasonId,
        })),
      };
    }

    return this.prismaService.character.update({
      where: { id },
      data,
    });
  }
}
