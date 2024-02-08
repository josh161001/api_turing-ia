import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateMenuDto {
  @ApiProperty({ example: 'Francesa' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Francesa con queso' })
  @IsString()
  description: string;

  @ApiProperty({ example: 10 })
  @IsNumber()
  price: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  category_id: number;
}
