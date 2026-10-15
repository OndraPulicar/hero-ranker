import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateCharacterDto } from './create-character.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateCharacterDto extends PartialType(
  OmitType(CreateCharacterDto, ['seriesId'] as const),
) {
  @IsOptional()
  @IsString()
  ratingInfo?: string;
}
