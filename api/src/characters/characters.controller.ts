import {
  Controller,
  BadRequestException,
  Get,
  Post,
  Param,
  ParseIntPipe,
  Query,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { GetCharactersDto } from './dto/get-characters.dto';
import { CharactersService } from './characters.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { StorageService } from 'src/storage/storage.service';

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

  @Post('image')
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(@UploadedFile() file?: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Image file is required');
    }

    await this.storageService.upload(
      file.buffer,
      'characters/test/walter-white.jpg',
      file.mimetype,
    );

    return { message: 'Character image uploaded successfully' };
  }
}
