import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  Req,
  UseInterceptors,
  UploadedFile,
  Body,
  Post,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { GetCharactersDto } from './dto/get-characters.dto';
import { CharactersService } from './characters.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateCharacterDto } from './dto/create-character.dto';
import { UpdateCharacterDto } from './dto/update-character.dto';
import { Character } from '@hero-ranker/shared/schemas/character';
import { AdminGuard } from 'src/auth/admin.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { OptionalJwtAuthGuard } from 'src/auth/optional-jwt-auth.guard';
import { type Request } from 'express';

@Controller('characters')
export class CharactersController {
  constructor(private readonly charactersService: CharactersService) {}

  @Get()
  getCharacters(@Query() query: GetCharactersDto): Promise<Character[]> {
    return this.charactersService.getCharacters(query);
  }

  @Get(':id')
  @UseGuards(OptionalJwtAuthGuard)
  getCharacterById(
    @Req() request: Request,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Character> {
    return this.charactersService.getCharacterById(id, request.user?.userId);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  createCharacter(
    @Body() dto: CreateCharacterDto,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<Character> {
    return this.charactersService.createCharacter(dto, file);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
  updateCharacter(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCharacterDto,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<Character> {
    return this.charactersService.updateCharacter(id, dto, file);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Delete(':id')
  deleteCharacter(@Param('id', ParseIntPipe) id: number): Promise<Character> {
    return this.charactersService.deleteCharacter(id);
  }
}
