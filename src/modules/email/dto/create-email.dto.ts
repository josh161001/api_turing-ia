import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class CreateEmailDto {
  @ApiProperty({ example: 'estrella161610@gmail.com' })
  @IsEmail()
  email: string;
}
