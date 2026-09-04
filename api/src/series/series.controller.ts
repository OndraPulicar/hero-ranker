import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
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
}