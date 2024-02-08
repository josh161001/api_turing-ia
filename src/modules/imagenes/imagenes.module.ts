import { Module } from '@nestjs/common';
import { ImagenesService } from './imagenes.service';
import { ImagenesController } from './imagenes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Imagene } from './entities/imagene.entity';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { Menu } from '../menu/entities/menu.entity';
import { Testimony } from '../testimonies/entities/testimony.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Imagene, User, Menu, Testimony])],
  controllers: [ImagenesController],
  providers: [ImagenesService, UsersService],
  exports: [ImagenesService],
})
export class ImagenesModule {}
