import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import {
  EMAIL_HOST,
  USER_EMAIL,
  USER_EMAIL_PASSWORD,
} from 'src/config/config.keys';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        transport: {
          host: config.get<string>(EMAIL_HOST),
          secure: false,
          auth: {
            user: config.get<string>(USER_EMAIL),
            pass: config.get<string>(USER_EMAIL_PASSWORD),
          },
        },
        defaults: {
          from: '"No Reply" x x ',
        },
      }),
    }),
  ],
  controllers: [EmailController],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
