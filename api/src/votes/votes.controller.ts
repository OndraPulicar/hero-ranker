import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateVoteDto } from './dto/create-vote.dto';
import { GetVotesDto } from './dto/get-votes.dto';
import { UpdateVoteDto } from './dto/update-vote.dto';
import { VotesService } from './votes.service';
import { Vote } from '@hero-ranker/shared/schemas/votes';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { type Request } from 'express';

@Controller('votes')
export class VotesController {
  constructor(private readonly votesService: VotesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  createVote(
    @Req() request: Request,
    @Body() createVoteDto: CreateVoteDto,
  ): Promise<Vote> {
    return this.votesService.createVote({
      ...createVoteDto,
      userId: request.user!.userId,
    });
  }

  @Get()
  getVotes(@Query() query: GetVotesDto): Promise<Vote[]> {
    return this.votesService.getVotes(query);
  }

  @Get(':id')
  getVoteById(@Param('id', ParseIntPipe) id: number): Promise<Vote> {
    return this.votesService.getVoteById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  updateVote(
    @Req() request: Request,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateVoteDto: UpdateVoteDto,
  ): Promise<Vote> {
    return this.votesService.updateVote(
      id,
      updateVoteDto,
      request.user!.userId,
    );
  }

  @Delete(':id')
  deleteVote(@Param('id', ParseIntPipe) id: number): Promise<Vote> {
    return this.votesService.deleteVote(id);
  }
}
