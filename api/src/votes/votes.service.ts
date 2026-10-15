import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from 'src/../generated/prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetVotesDto } from './dto/get-votes.dto';
import { UpdateVoteDto } from './dto/update-vote.dto';
import { Vote, VoteSchema } from '@hero-ranker/shared/schemas/votes';
import { CreateVoteData } from './types/create-vote-data';
import { CharactersService } from 'src/characters/characters.service';

@Injectable()
export class VotesService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly characterService: CharactersService,
  ) {}

  async createVote(createVoteData: CreateVoteData) {
    const result = await this.prismaService.$transaction(async (tx) => {
      const createdVote = await tx.vote.create({
        data: createVoteData,
      });

      await this.characterService.updateCharacterVoteStats(
        tx,
        createVoteData.characterId,
        {
          totalVotes: 1,
          evilVotes: createVoteData.isEvil ? 1 : undefined,
          points: createVoteData.points,
        },
      );

      return VoteSchema.parse(createdVote);
    });

    void this.characterService.updateCharacterRatingInfo(result.characterId);

    return result;
  }

  async getVotes(query: GetVotesDto) {
    const votes = await this.prismaService.vote.findMany({
      where: {
        characterId: query.characterId,
        userId: query.userId,
      },
      orderBy: { createdAt: 'desc' },
      take: query.limit,
    });

    return VoteSchema.array().parse(votes);
  }

  async getVoteById(id: number) {
    const vote = await this.prismaService.vote.findUnique({
      where: { id },
    });

    if (!vote) {
      throw new NotFoundException(`Vote with id ${id} not found`);
    }

    return VoteSchema.parse(vote);
  }

  async updateVote(id: number, updateVoteDto: UpdateVoteDto, userId: number) {
    const result = await this.prismaService.$transaction(async (tx) => {
      const currentVote = await this.getCurrentVoteOrThrowError(tx, id);

      if (currentVote.userId !== userId) {
        throw new ForbiddenException();
      }

      const nextIsEvil = updateVoteDto.isEvil ?? currentVote.isEvil;
      const nextPoints = updateVoteDto.points ?? currentVote.points;
      const evilVotesDelta = Number(nextIsEvil) - Number(currentVote.isEvil);
      const pointsDelta = nextPoints - currentVote.points;

      const updatedVote = await tx.vote.update({
        where: { id },
        data: {
          isEvil: nextIsEvil,
          points: nextPoints,
        },
      });

      if (evilVotesDelta !== 0 || pointsDelta !== 0) {
        await this.characterService.updateCharacterVoteStats(
          tx,
          currentVote.characterId,
          {
            evilVotes: evilVotesDelta !== 0 ? evilVotesDelta : undefined,
            points: pointsDelta !== 0 ? pointsDelta : undefined,
          },
        );
      }

      return VoteSchema.parse(updatedVote);
    });

    void this.characterService.updateCharacterRatingInfo(result.characterId);

    return result;
  }

  async deleteVote(id: number, userId: number) {
    const result = await this.prismaService.$transaction(async (tx) => {
      const currentVote = await this.getCurrentVoteOrThrowError(tx, id);

      if (currentVote.userId !== userId) {
        throw new ForbiddenException();
      }

      await this.characterService.updateCharacterVoteStats(
        tx,
        currentVote.characterId,
        {
          totalVotes: -1,
          evilVotes: currentVote.isEvil ? -1 : undefined,
          points: -currentVote.points,
        },
      );

      return VoteSchema.parse(await tx.vote.delete({ where: { id } }));
    });

    void this.characterService.updateCharacterRatingInfo(result.characterId);

    return result;
  }

  private async getCurrentVoteOrThrowError(
    tx: Prisma.TransactionClient,
    id: number,
  ): Promise<Vote> {
    const currentVote = await tx.vote.findUnique({
      where: { id },
      select: {
        id: true,
        characterId: true,
        isEvil: true,
        points: true,
        userId: true,
      },
    });

    if (!currentVote) {
      throw new NotFoundException(`Vote with id ${id} not found`);
    }

    return VoteSchema.parse(currentVote);
  }
}
