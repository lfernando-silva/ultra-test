import { IsArray, Length, IsInt, IsDateString, IsUUID } from 'class-validator';

export class CreateGameDto {
  @Length(4, 150)
  title: string;

  @IsInt()
  price: number;

  @IsArray()
  tags: string;

  @IsDateString()
  releaseDate: Date;

  @IsUUID()
  publisherId: string;
}
