import {
  Body,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { UpdateSeasonDto } from './dto/update-season.dto';
import { SeasonsService } from './seasons.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AdminGuard } from 'src/auth/admin.guard';

@Controller('seasons')
export class SeasonsController {
  constructor(private readonly seasonsService: SeasonsService) {}

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Patch(':id')
  updateSeason(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateSeasonDto,
  ) {
    return this.seasonsService.updateSeason(id, dto);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Delete(':id')
  deleteSeason(@Param('id', ParseIntPipe) id: number) {
    return this.seasonsService.deleteSeason(id);
  }
}
