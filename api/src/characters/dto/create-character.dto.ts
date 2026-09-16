import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  IsInt,
} from 'class-validator';

import { Transform, Type } from 'class-transformer';

export class CreateCharacterDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  alternativeName?: string;

  @Type(() => Number)
  @IsNumber()
  seriesId!: number;

  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  appearsInAllSeasons!: boolean;

  @Transform(({ value }) => {
    if (typeof value !== 'string') {
      throw new Error('Expected string');
    }

    return JSON.parse(value) as number[];
  })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  seasons?: number[];
}
