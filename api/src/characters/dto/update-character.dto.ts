import { IsArray, IsBoolean, IsOptional, IsString } from 'class-validator';

// TODO: rename to UpdateCharacterDto
// TODO: remove imageKey from the class
export class UpdateCharactersDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  alternativeName?: string;

  @IsOptional()
  @IsBoolean()
  appearsInAllSeasons?: boolean;

  // IDs of seasons where the character appears
  @IsOptional()
  @IsArray()
  seasons?: number[];

  @IsOptional()
  @IsString()
  imageKey?: string;
}
