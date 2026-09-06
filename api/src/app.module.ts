import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CharactersModule } from './characters/characters.module';
import { PrismaModule } from './prisma/prisma.module';
import { SeriesModule } from './series/series.module';

@Module({
  imports: [PrismaModule, SeriesModule, CharactersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
