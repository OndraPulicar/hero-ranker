import { Type } from 'class-transformer';
import { IsBoolean, IsInt, Max, Min } from 'class-validator';

export class CreateVoteDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  characterId!: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  userId!: number;

  @Type(() => Boolean)
  @IsBoolean()
  isEvil!: boolean;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(3)
  points!: number;
}
