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
  UseGuards,
} from '@nestjs/common';
import { GetCharactersBySeriesIdDto } from './dto/get-characters-by-series-id.dto';
import { SeriesService } from './series.service';
import { SeasonsService } from 'src/seasons/seasons.service';
import { CreateSeriesDto } from './dto/create-series.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateSeriesDto } from './dto/update-series.dto';
import { CreateSeasonDto } from 'src/seasons/dto/create-season.dto';
import { Series, SeriesDetail } from '@hero-ranker/shared/schemas/series';
import { Character } from '@hero-ranker/shared/schemas/character';
import { Season } from '@hero-ranker/shared/schemas/season';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AdminGuard } from 'src/auth/admin.guard';

@Controller('series')
export class SeriesController {
  constructor(
    private readonly seriesService: SeriesService,
    private readonly seasonsService: SeasonsService,
  ) {}

  @Get()
  getSeries(): Promise<Series[]> {
    return this.seriesService.getSeries();
  }

  @Get(':id')
  getSeriesById(@Param('id', ParseIntPipe) id: number): Promise<SeriesDetail> {
    return this.seriesService.getSeriesById(id);
  }

  @Get(':id/characters')
  getCharactersBySeriesId(
    @Param('id', ParseIntPipe) id: number,
    @Query() query: GetCharactersBySeriesIdDto,
  ): Promise<Character[]> {
    return this.seriesService.getCharactersBySeriesId(id, query);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  createSeries(
    @Body() dto: CreateSeriesDto,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<Series> {
    return this.seriesService.createSeries(dto, file);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post(':id/seasons')
  createSeason(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateSeasonDto,
  ): Promise<Season> {
    return this.seasonsService.createSeason(id, dto);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
  updateSeries(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateSeriesDto,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<Series> {
    return this.seriesService.updateSeries(id, dto, file);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Delete(':id')
  deleteSeries(@Param('id', ParseIntPipe) id: number): Promise<Series> {
    return this.seriesService.deleteSeries(id);
  }
}
