import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
  Patch,
} from '@nestjs/common';
import { GetCharactersBySeriesIdDto } from './dto/get-characters-by-series-id.dto';
import { SeriesService } from './series.service';
import { CreateSeriesDto } from './dto/create-series.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateSeriesDto } from './dto/update-series.dto';

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

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  createSeries(
    @Body() dto: CreateSeriesDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.seriesService.createSeries(dto, file);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
  updateSeries(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateSeriesDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.seriesService.updateSeries(id, dto, file);
  }
}
