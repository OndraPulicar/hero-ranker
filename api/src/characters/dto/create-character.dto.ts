import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

// TODO: remove imageKey from the class
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
  @IsOptional()
  @IsString()
  imageKey?: string;
}
