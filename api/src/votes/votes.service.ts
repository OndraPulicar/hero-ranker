import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from 'src/../generated/prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateVoteDto } from './dto/create-vote.dto';
import { GetVotesDto } from './dto/get-votes.dto';
import { UpdateVoteDto } from './dto/update-vote.dto';

type CurrentVote = Prisma.VoteGetPayload<{
  select: {
    characterId: true;
    isEvil: true;
    points: true;
  };
}>;

@Injectable()
export class VotesService {
  constructor(private readonly prismaService: PrismaService) {}

  async createVote(createVoteDto: CreateVoteDto) {
    return this.prismaService.$transaction(async (tx) => {
      const createdVote = await tx.vote.create({
        data: createVoteDto,
      });

      await tx.character.update({
        where: {
          id: createVoteDto.characterId,
        },
        data: {
          totalVotes: {
            increment: 1,
          },
          ...(createVoteDto.isEvil && {
            evilVotes: {
              increment: 1,
            },
          }),
          points: {
            increment: createVoteDto.points,
          },
        },
      });

      return createdVote;
    });
  }

  getVotes(query: GetVotesDto) {
    return this.prismaService.vote.findMany({
      where: {
        characterId: query.characterId,
        userId: query.userId,
      },
      orderBy: { createdAt: 'desc' },
      take: query.limit,
    });
  }

  async getVoteById(id: number) {
    const vote = await this.prismaService.vote.findUnique({
      where: { id },
    });

    if (!vote) {
      throw new NotFoundException(`Vote with id ${id} not found`);
    }

    return vote;
  }

  async updateVote(id: number, updateVoteDto: UpdateVoteDto) {
    return this.prismaService.$transaction(async (tx) => {
      const currentVote = await this.getCurrentVoteOrThrowError(tx, id);

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

      return updatedVote;
    });
  }

  async deleteVote(id: number) {
    return this.prismaService.$transaction(async (tx) => {
      const currentVote = await this.getCurrentVoteOrThrowError(tx, id);

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

      return tx.vote.delete({ where: { id } });
    });
  }

  private async getCurrentVoteOrThrowError(
    tx: Prisma.TransactionClient,
    id: number,
  ): Promise<CurrentVote> {
    const currentVote = await tx.vote.findUnique({
      where: { id },
      select: {
        characterId: true,
        isEvil: true,
        points: true,
      },
    });

    if (!currentVote) {
      throw new NotFoundException(`Vote with id ${id} not found`);
    }

    return currentVote;
  }
}
