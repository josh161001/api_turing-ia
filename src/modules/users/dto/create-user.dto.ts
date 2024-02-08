import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'John Doe' })
  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'correo@correo.com' })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password1234' })
  @IsString()
  @MinLength(6)
  @MaxLength(60)
  @IsNotEmpty()
  password: string;
}
