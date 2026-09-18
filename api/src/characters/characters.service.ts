import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetCharactersDto } from './dto/get-characters.dto';
import { UpdateCharacterDto } from './dto/update-character.dto';
import { Prisma } from 'generated/prisma/client';
import { CreateCharacterDto } from './dto/create-character.dto';
import { StorageService } from 'src/storage/storage.service';
import { Character } from '@hero-ranker/shared/schemas/character';

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
      const imageKey = this.storageService.createImageKey(
        character.id,
        'characters',
      );

      try {
        await this.storageService.upload(file.buffer, imageKey, file.mimetype);
        return this.prismaService.character.update({
          where: { id: character.id },
          data: { imageKey },
        });
      } catch (error) {
        this.logger.error(`Failed to upload image for the character`, error);
      }
    }

    return character;
  }

  async updateCharacter(
    id: number,
    dto: UpdateCharacterDto,
    file?: Express.Multer.File,
  ) {
    const data: Prisma.CharacterUpdateInput = {
      name: dto.name,
      alternativeName: dto.alternativeName,
      appearsInAllSeasons: dto.appearsInAllSeasons,
    };

    if (dto.seasons !== undefined) {
      data.seasons = {
        set: dto.seasons.map((seasonId) => ({
          id: seasonId,
        })),
      };
    }

    const character = await this.prismaService.character.update({
      where: { id },
      data,
    });

    if (file) {
      return await this.uploadCharacterImageAndUpdate(character, file);
    }

    return character;
  }

  private async uploadCharacterImageAndUpdate(
    character: Character,
    file: Express.Multer.File,
  ) {
    const imageKey = this.storageService.createImageKey(
      character.id,
      'characters',
    );

    try {
      await this.storageService.upload(file.buffer, imageKey, file.mimetype);
      return this.prismaService.character.update({
        where: { id: character.id },
        data: { imageKey },
      });
    } catch (error) {
      this.logger.error(
        `Failed to upload image for character ${character.id}`,
        error,
      );
      return character;
    }
  }

  async deleteCharacter(id: number) {
    return this.prismaService.character.delete({ where: { id } });
  }

  private readonly logger = new Logger(CharactersService.name);
}
