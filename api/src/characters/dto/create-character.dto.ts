import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateCharacterDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  alternativeName?: string;

  @IsNumber()
  seriesId!: number;

  @IsBoolean()
  appearsInAllSeasons!: boolean;

  @IsOptional()
  @IsArray()
  seasons?: number[];
}
