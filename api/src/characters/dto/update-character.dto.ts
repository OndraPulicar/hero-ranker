import {
  IsArray,
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateCharacterDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  alternativeName?: string;

  @Transform(({ value }) => value === 'true')
  @IsOptional()
  @IsBoolean()
  appearsInAllSeasons?: boolean;

  // IDs of seasons where the character appears
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
