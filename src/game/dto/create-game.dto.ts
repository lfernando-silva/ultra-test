import { ApiProperty } from '@nestjs/swagger';
import { IsArray, Length, IsInt, IsDateString, IsUUID } from 'class-validator';

export class CreateGameDto {
  @ApiProperty()
  @Length(4, 150)
  title: string;

  @ApiProperty()
  @IsInt()
  price: number;

  @ApiProperty()
  @IsArray()
  tags: string;

  @ApiProperty()
  @IsDateString()
  releaseDate: Date;

  @ApiProperty()
  @IsUUID()
  publisherId: string;
}
