import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, Max, Min } from 'class-validator';

export type Alignment = 'GOOD' | 'EVIL' | 'NEUTRAL';

export class GetCharactersBySeriesIdDto {
  @IsOptional()
  @IsIn(['GOOD', 'EVIL', 'NEUTRAL'])
  alignment?: Alignment;

  @IsOptional()
  @IsIn(['rating', 'name'])
  sortBy?: 'rating' | 'name';

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number;
}
