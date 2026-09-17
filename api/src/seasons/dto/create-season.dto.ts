import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateSeasonDto {
  @IsInt()
  seasonNumber!: number;

  @IsOptional()
  @IsString()
  alternativeTitle?: string;
}
