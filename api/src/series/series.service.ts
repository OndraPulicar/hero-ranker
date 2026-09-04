import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SeriesService {
    constructor(private readonly prismaService: PrismaService) {}

    getSeries() {
        return this.prismaService.series.findMany();
    }

    async getSeriesById(id: number) {
        const series = await this.prismaService.series.findUnique({
            where: {
                id: id,
            },
            include: {
                characters: true,
                seasons: {
                    include: {
                        characters: true,
                    },
                },
            },
        });

        if (!series) {
            throw new NotFoundException(`Series with id ${id} not found`);
        }

        return series;
    }
}