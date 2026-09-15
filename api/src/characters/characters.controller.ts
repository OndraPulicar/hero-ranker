import {
  Controller,
  BadRequestException,
  Get,
  Param,
  ParseIntPipe,
  Query,
  UseInterceptors,
  UploadedFile,
  Put,
} from '@nestjs/common';
import { GetCharactersDto } from './dto/get-characters.dto';
import { CharactersService } from './characters.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { StorageService } from 'src/storage/storage.service';
import { randomUUID } from 'crypto';

@Controller('characters')
export class CharactersController {
  constructor(
    private readonly storageService: StorageService,
    private readonly charactersService: CharactersService,
  ) {}

  @Get()
  getCharacters(@Query() query: GetCharactersDto) {
    return this.charactersService.getCharacters(query);
  }

  @Get(':id')
  getCharacterById(@Param('id', ParseIntPipe) id: number) {
    return this.charactersService.getCharacterById(id);
  }

  @Put(':id/image')
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    await this.charactersService.getCharacterById(id);

    if (!file) {
      throw new BadRequestException('Image file is required');
    }

    const imageId = randomUUID();
    const imageKey = `characters/${id}/${imageId}.jpg`;

    await this.storageService.upload(file.buffer, imageKey, file.mimetype);

    await this.charactersService.updateCharacter(id, { imageKey });

    return { message: 'Character image uploaded successfully' };
  }
}
