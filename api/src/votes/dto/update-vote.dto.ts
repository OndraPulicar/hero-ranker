import { Type } from 'class-transformer';
import { IsBoolean, IsInt, IsOptional, Max, Min } from 'class-validator';

export class UpdateVoteDto {
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isEvil?: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(3)
  points?: number;
}
