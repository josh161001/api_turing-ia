import { PartialType } from '@nestjs/mapped-types';
import { PasswordUserDto } from './password-user.dto';

export class UpdatePasswordUserDto extends PartialType(PasswordUserDto) {}
