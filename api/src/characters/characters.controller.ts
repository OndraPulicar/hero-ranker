import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  UseInterceptors,
  UploadedFile,
  Body,
  Post,
} from '@nestjs/common';
import { GetCharactersDto } from './dto/get-characters.dto';
import { CharactersService } from './characters.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateCharacterDto } from './dto/create-character.dto';

@Controller('characters')
export class CharactersController {
  constructor(private readonly charactersService: CharactersService) {}

  @Get()
  getCharacters(@Query() query: GetCharactersDto) {
    return this.charactersService.getCharacters(query);
  }

  @Get(':id')
  getCharacterById(@Param('id', ParseIntPipe) id: number) {
    return this.charactersService.getCharacterById(id);
  }

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  createCharacter(
    @Body() dto: CreateCharacterDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.charactersService.createCharacter(dto, file);
  }
}
