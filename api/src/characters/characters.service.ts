import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetCharactersDto } from './dto/get-characters.dto';

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
}
