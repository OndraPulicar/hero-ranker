import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSeasonDto } from './dto/create-season.dto';

export class SeasonsService {
  constructor(private readonly prismaService: PrismaService) {}

  async createSeason(seriesId: number, dto: CreateSeasonDto) {
    return this.prismaService.season.create({
      data: { ...dto, seriesId },
    });
  }
}
