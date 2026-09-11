import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { StorageModule } from 'src/storage/storage.module';
import { CharactersController } from './characters.controller';
import { CharactersService } from './characters.service';

@Module({
  imports: [PrismaModule, StorageModule],
  controllers: [CharactersController],
  providers: [CharactersService],
})
export class CharactersModule {}
