import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { StorageModule } from 'src/storage/storage.module';
import { CharactersController } from './characters.controller';
import { CharactersService } from './characters.service';
import { AiModule } from 'src/ai/ai.module';

@Module({
  imports: [PrismaModule, StorageModule, AiModule],
  controllers: [CharactersController],
  providers: [CharactersService],
  exports: [CharactersService],
})
export class CharactersModule {}
