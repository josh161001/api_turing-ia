import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class PasswordUserDto {
  @ApiProperty({ example: 'password1234' })
  @IsString()
  @MinLength(6)
  @MaxLength(60)
  @IsNotEmpty()
  password: string;
}
