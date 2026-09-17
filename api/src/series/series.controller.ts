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
  Delete,
} from '@nestjs/common';
import { GetCharactersBySeriesIdDto } from './dto/get-characters-by-series-id.dto';
import { SeriesService } from './series.service';
import { SeasonsService } from 'src/seasons/seasons.service';
import { CreateSeriesDto } from './dto/create-series.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateSeriesDto } from './dto/update-series.dto';
import { CreateSeasonDto } from 'src/seasons/dto/create-season.dto';

@Controller('series')
export class SeriesController {
  constructor(
    private readonly seriesService: SeriesService,
    private readonly seasonsService: SeasonsService,
  ) {}

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

  @Post(':id/seasons')
  createSeason(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateSeasonDto,
  ) {
    return this.seasonsService.createSeason(id, dto);
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

  @Delete(':id')
  deleteSeries(@Param('id', ParseIntPipe) id: number) {
    return this.seriesService.deleteSeries(id);
  }
}
