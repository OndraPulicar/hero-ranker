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
  Patch,
  Delete,
} from '@nestjs/common';
import { GetCharactersDto } from './dto/get-characters.dto';
import { CharactersService } from './characters.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateCharacterDto } from './dto/create-character.dto';
import { UpdateCharacterDto } from './dto/update-character.dto';
import { Character } from '@hero-ranker/shared/schemas/character';

@Controller('characters')
export class CharactersController {
  constructor(private readonly charactersService: CharactersService) {}

  @Get()
  getCharacters(@Query() query: GetCharactersDto): Promise<Character[]> {
    return this.charactersService.getCharacters(query);
  }

  @Get(':id')
  getCharacterById(@Param('id', ParseIntPipe) id: number): Promise<Character> {
    return this.charactersService.getCharacterById(id);
  }

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  createCharacter(
    @Body() dto: CreateCharacterDto,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<Character> {
    return this.charactersService.createCharacter(dto, file);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
  updateCharacter(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCharacterDto,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<Character> {
    return this.charactersService.updateCharacter(id, dto, file);
  }

  @Delete(':id')
  deleteCharacter(@Param('id', ParseIntPipe) id: number): Promise<Character> {
    return this.charactersService.deleteCharacter(id);
  }
}
