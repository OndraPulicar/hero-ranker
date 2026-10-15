import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { VotesController } from './votes.controller';
import { VotesService } from './votes.service';
import { CharactersModule } from 'src/characters/characters.module';

@Module({
  imports: [PrismaModule, CharactersModule],
  controllers: [VotesController],
  providers: [VotesService],
})
export class VotesModule {}
