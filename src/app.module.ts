import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { TypeOrmModule } from '@nestjs/typeorm';
import {
  DATABASE_HOST,
  DATABASE_NAME,
  DATABASE_PASSWORD,
  DATABASE_PORT,
  DATABASE_SSL,
  DATABASE_USERNAME,
  PORT,
} from './config/config.keys';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ImagenesModule } from './modules/imagenes/imagenes.module';
import { MenuModule } from './modules/menu/menu.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { AccessControlModule } from 'nest-access-control';
import { roles } from './app.roles';
import { TestimoniesModule } from './modules/testimonies/testimonies.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../', 'client'),
    }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>(DATABASE_HOST),
        port: parseInt(config.get<string>(DATABASE_PORT), 10),
        username: config.get<string>(DATABASE_USERNAME),
        password: config.get<string>(DATABASE_PASSWORD),
        database: config.get<string>(DATABASE_NAME),
        synchronize: true,
        autoLoadEntities: true,
        ssl: config.get<string>(DATABASE_SSL) === 'true',
        extra: {
          ssl:
            config.get<string>(DATABASE_SSL) === 'true'
              ? { rejectUnauthorized: false }
              : null,
        },
        dropSchema: false,
        entities: ['dist/**/*/*.entity{.ts,.js}'],
        migrations: ['dist/database/migrations/*{.ts,.js}'],
      }),
    }),
    AccessControlModule.forRoles(roles),
    AuthModule,
    UsersModule,
    ConfigModule,
    ImagenesModule,
    MenuModule,
    CategoriesModule,
    TestimoniesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  static port: number | string;
  constructor(private readonly configService: ConfigService) {
    AppModule.port = this.configService.get(PORT);
  }
}
