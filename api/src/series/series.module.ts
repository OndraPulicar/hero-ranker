import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { SeriesController } from './series.controller';
import { SeriesService } from './series.service';

@Module({
  imports: [PrismaModule],
  controllers: [SeriesController],
  providers: [SeriesService],
})
export class SeriesModule {}
