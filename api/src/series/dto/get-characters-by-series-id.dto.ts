import { CharacterFilters } from '@hero-ranker/shared/schemas/character';
import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, Max, Min } from 'class-validator';

export type Karma = 'GOOD' | 'EVIL' | 'NEUTRAL';

export class GetCharactersBySeriesIdDto {
  @IsOptional()
  @IsIn(['GOOD', 'EVIL', 'NEUTRAL'])
  karma?: CharacterFilters['karma'];

  @IsOptional()
  @IsIn(['NAME', 'RATING', 'KARMA'])
  sortBy?: CharacterFilters['sortBy'];

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  season?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number;
}
