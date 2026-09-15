import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetCharactersDto } from './dto/get-characters.dto';
import { UpdateCharactersDto } from './dto/update-character.dto';
import { Prisma } from 'generated/prisma/client';
import { CreateCharacterDto } from './dto/create-character.dto';
import { StorageService } from 'src/storage/storage.service';
import { randomUUID } from 'crypto';

@Injectable()
export class CharactersService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly storageService: StorageService,
  ) {}

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

  async createCharacter(dto: CreateCharacterDto, file?: Express.Multer.File) {
    const data: Prisma.CharacterCreateInput = {
      name: dto.name,
      alternativeName: dto.alternativeName,
      appearsInAllSeasons: dto.appearsInAllSeasons,
      series: { connect: { id: dto.seriesId } },
      seasons: { connect: dto.seasons?.map((id) => ({ id })) },
    };

    const character = await this.prismaService.character.create({ data });

    if (file) {
      const imageKey = this.createImageKey(character.id);

      await this.storageService.upload(file.buffer, imageKey, file.mimetype);
      return this.updateCharacter(character.id, { imageKey: imageKey });
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

  private createImageKey(id: number) {
    const imageId = randomUUID();
    return `characters/${id}/${imageId}.jpg`;
  }
}
