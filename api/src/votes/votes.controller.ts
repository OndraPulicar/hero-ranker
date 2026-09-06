import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { CreateVoteDto } from './dto/create-vote.dto';
import { GetVotesDto } from './dto/get-votes.dto';
import { VotesService } from './votes.service';

@Controller('votes')
export class VotesController {
  constructor(private readonly votesService: VotesService) {}

  @Post()
  createVote(@Body() createVoteDto: CreateVoteDto) {
    return this.votesService.createVote(createVoteDto);
  }

  @Get()
  getVotes(@Query() query: GetVotesDto) {
    return this.votesService.getVotes(query);
  }

  @Get(':id')
  getVoteById(@Param('id', ParseIntPipe) id: number) {
    return this.votesService.getVoteById(id);
  }

  @Delete(':id')
  deleteVote(@Param('id', ParseIntPipe) id: number) {
    return this.votesService.deleteVote(id);
  }
}
