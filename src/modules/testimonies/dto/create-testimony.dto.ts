import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateTestimonyDto {
  @ApiProperty({ example: 'Testimony 1' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'This is a testimony' })
  @IsString()
  description: string;
}
