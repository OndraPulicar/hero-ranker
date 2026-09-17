import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { SeriesController } from './series.controller';
import { SeriesService } from './series.service';
import { StorageModule } from 'src/storage/storage.module';
import { SeasonsModule } from 'src/seasons/seasons.module';

@Module({
  imports: [PrismaModule, StorageModule, SeasonsModule],
  controllers: [SeriesController],
  providers: [SeriesService],
})
export class SeriesModule {}
