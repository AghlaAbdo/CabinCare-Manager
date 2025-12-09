import { IsString, IsOptional, MinLength } from 'class-validator';

export class CreateCabinDto {
  @IsString()
  @MinLength(1)
  name: string;

  @IsString()
  @MinLength(1)
  location: string;

  @IsString()
  @IsOptional()
  description?: string;
}
