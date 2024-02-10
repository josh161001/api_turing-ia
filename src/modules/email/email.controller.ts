import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { EmailService } from './email.service';
import { CreateEmailDto } from './dto/create-email.dto';
import { UpdateEmailDto } from './dto/update-email.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('email')
@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('send-instructions')
  async sendInstructions(@Body() createEmailDto: CreateEmailDto) {
    await this.emailService.emailRecuperation(createEmailDto.email);
    return {
      message: 'Correo enviado',
    };
  }
}
