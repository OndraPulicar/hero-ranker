import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { SeriesController } from './series.controller';
import { SeriesService } from './series.service';
import { StorageModule } from 'src/storage/storage.module';

@Module({
  imports: [PrismaModule, StorageModule],
  controllers: [SeriesController],
  providers: [SeriesService],
})
export class SeriesModule {}
