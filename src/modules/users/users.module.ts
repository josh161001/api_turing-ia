import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

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
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
