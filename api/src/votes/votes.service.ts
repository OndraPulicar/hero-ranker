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
      return await this.prismaService.vote.create({
        data: createVoteDto,
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
      return await this.prismaService.vote.update({
        where: { id },
        data: {
          ...(updateVoteDto.isEvil !== undefined && {
            isEvil: updateVoteDto.isEvil,
          }),
          ...(updateVoteDto.points !== undefined && {
            points: updateVoteDto.points,
          }),
        },
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
      return await this.prismaService.vote.delete({ where: { id } });
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
