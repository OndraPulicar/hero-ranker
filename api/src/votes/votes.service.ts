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

@Injectable()
export class VotesService {
  constructor(private readonly prismaService: PrismaService) {}

  async createVote(createVoteData: CreateVoteData) {
    return this.prismaService.$transaction(async (tx) => {
      const createdVote = await tx.vote.create({
        data: createVoteData,
      });

      await tx.character.update({
        where: {
          id: createVoteData.characterId,
        },
        data: {
          totalVotes: {
            increment: 1,
          },
          ...(createVoteData.isEvil && {
            evilVotes: {
              increment: 1,
            },
          }),
          points: {
            increment: createVoteData.points,
          },
        },
      });

      return VoteSchema.parse(createdVote);
    });
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
    return this.prismaService.$transaction(async (tx) => {
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
        await tx.character.update({
          where: { id: currentVote.characterId },
          data: {
            ...(evilVotesDelta !== 0 && {
              evilVotes: { increment: evilVotesDelta },
            }),
            ...(pointsDelta !== 0 && {
              points: { increment: pointsDelta },
            }),
          },
        });
      }

      return VoteSchema.parse(updatedVote);
    });
  }

  async deleteVote(id: number, userId: number) {
    return this.prismaService.$transaction(async (tx) => {
      const currentVote = await this.getCurrentVoteOrThrowError(tx, id);

      if (currentVote.userId !== userId) {
        throw new ForbiddenException();
      }

      await tx.character.update({
        where: { id: currentVote.characterId },
        data: {
          totalVotes: { decrement: 1 },
          ...(currentVote.isEvil && {
            evilVotes: { decrement: 1 },
          }),
          points: { decrement: currentVote.points },
        },
      });

      return VoteSchema.parse(await tx.vote.delete({ where: { id } }));
    });
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

    console.log('updated vote in getCurrentVoteOrThrowError: ', currentVote);

    return VoteSchema.parse(currentVote);
  }
}
