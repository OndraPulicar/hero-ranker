import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { GetCharactersBySeriesIdDto } from './dto/get-characters-by-series-id.dto';
import { SeriesService } from './series.service';

@Controller('series')
export class SeriesController {
  constructor(private readonly seriesService: SeriesService) {}

  @Get()
  getSeries() {
    return this.seriesService.getSeries();
  }

  @Get(':id')
  getSeriesById(@Param('id', ParseIntPipe) id: number) {
    return this.seriesService.getSeriesById(id);
  }

  @Get(':id/characters')
  getCharactersBySeriesId(
    @Param('id', ParseIntPipe) id: number,
    @Query() query: GetCharactersBySeriesIdDto,
  ) {
    return this.seriesService.getCharactersBySeriesId(id, query);
  }
}
