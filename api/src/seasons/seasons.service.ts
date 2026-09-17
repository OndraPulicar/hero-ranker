import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSeasonDto } from './dto/create-season.dto';
import { UpdateSeasonDto } from './dto/update-season.dto';

export class SeasonsService {
  constructor(private readonly prismaService: PrismaService) {}

  async createSeason(seriesId: number, dto: CreateSeasonDto) {
    return this.prismaService.season.create({
      data: { ...dto, seriesId },
    });
  }

  async updateSeason(id: number, dto: UpdateSeasonDto) {
    return this.prismaService.season.update({
      where: { id },
      data: dto,
    });
  }

  async deleteSeason(id: number) {
    return this.prismaService.season.delete({ where: { id } });
  }
}
