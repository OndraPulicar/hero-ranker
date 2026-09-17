import { Body, Controller, Param, ParseIntPipe, Patch } from '@nestjs/common';
import { UpdateSeasonDto } from './dto/update-season.dto';
import { SeasonsService } from './seasons.service';

@Controller('seasons')
export class SeasonsController {
  constructor(private readonly seasonsService: SeasonsService) {}

  @Patch(':id')
  updateSeason(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateSeasonDto,
  ) {
    return this.seasonsService.updateSeason(id, dto);
  }
}
