import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from 'src/../generated/prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateVoteDto } from './dto/create-vote.dto';
import { GetVotesDto } from './dto/get-votes.dto';
import { UpdateVoteDto } from './dto/update-vote.dto';

@Injectable()
export class VotesService {
  constructor(private readonly prismaService: PrismaService) {}

  async createVote(createVoteDto: CreateVoteDto) {
    try {
      await this.prismaService.$transaction(async (tx) => {
        await tx.vote.create({
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
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException(
            'This user has already voted for this character',
          );
        }

        if (error.code === 'P2003') {
          throw new NotFoundException('Character or user not found');
        }
      }

      throw error;
    }
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
    try {
      return await this.prismaService.$transaction(async (tx) => {
        const currentVote = await tx.vote.findUnique({
          where: { id },
          select: {
            isEvil: true,
            points: true,
            characterId: true,
          },
        });

        if (!currentVote) {
          throw new NotFoundException(`Vote with id ${id} not found`);
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

        return updatedVote;
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(`Vote with id ${id} not found`);
      }

      throw error;
    }
  }

  async deleteVote(id: number) {
    try {
      return await this.prismaService.$transaction(async (tx) => {
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
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`Vote with id ${id} not found`);
        }
      }

      throw error;
    }
  }
}
