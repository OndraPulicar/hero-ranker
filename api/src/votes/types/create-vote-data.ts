import { CreateVoteDto } from '../dto/create-vote.dto';

export type CreateVoteData = CreateVoteDto & {
  userId: number;
};
