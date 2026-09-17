import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreateSeasonDto } from 'src/seasons/dto/create-season.dto';

export class CreateSeriesDto {
  @IsString()
  title!: string;

  @Type(() => Number)
  @IsNumber()
  yearOfProduction!: number;

  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  isLimited!: boolean;

  @Transform(({ value }) => JSON.parse(value as string) as unknown[])
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSeasonDto)
  seasons?: CreateSeasonDto[];
}
