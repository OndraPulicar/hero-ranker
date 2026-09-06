import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { GetCharactersDto } from './dto/get-characters.dto';
import { CharactersService } from './characters.service';

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
}
