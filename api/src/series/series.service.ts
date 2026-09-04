import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SeriesService {
    constructor(private readonly prismaService: PrismaService) {}

    getSeries() {
        return this.prismaService.series.findMany();
    }
}