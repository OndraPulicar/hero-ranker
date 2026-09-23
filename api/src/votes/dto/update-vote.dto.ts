import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateVoteDto } from './create-vote.dto';

export class UpdateVoteDto extends PartialType(
  OmitType(CreateVoteDto, ['characterId'] as const),
) {}
