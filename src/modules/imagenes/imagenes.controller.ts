import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Param,
  NotFoundException,
  Delete,
  BadRequestException,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { renameImage } from './helpers/upload.helper';

import { ImagenesService } from './imagenes.service';
import { UsersService } from '../users/users.service';

import { ApiTags } from '@nestjs/swagger';
import * as fs from 'fs';
import { Auth } from 'src/common/decorator/auth.decorator';
import { AppResources } from 'src/app.roles';

@ApiTags('imagenes')
@Controller('imagenes')
export class ImagenesController {
  constructor(
    private readonly imagenesService: ImagenesService,
    private readonly userService: UsersService,
  ) {}

  @Auth({
    resource: AppResources.imagenes,
    action: 'create',
    possession: 'own',
  })
  @UseInterceptors(
    FileInterceptor('imagen', {
      storage: diskStorage({
        destination: './upload',
        filename: renameImage,
      }),
    }),
  )
  @Post(':userId')
  async createImagenUser(
    @UploadedFile() imagen: Express.Multer.File,
    @Param('userId') userId: string,
  ) {
    try {
      const baseUrl = 'https://api-turing.onrender.com';
      const imageUrl = `${baseUrl}/upload/${imagen.filename}`;

      const createdImagen = await this.imagenesService.createImagenUser(
        userId,
        imageUrl,
      );

      return createdImagen;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Auth({
    resource: AppResources.imagenes,
    action: 'create',
    possession: 'any',
  })
  @Post('menu/:menuId')
  @UseInterceptors(
    FileInterceptor('imagen', {
      storage: diskStorage({
        destination: './upload',
        filename: renameImage,
      }),
    }),
  )
  async createImagenMenu(
    @UploadedFile() imagen: Express.Multer.File,
    @Param('menuId') menuId: number,
  ) {
    try {
      const baseUrl = 'https://api-turing.onrender.com';
      const imageUrl = `${baseUrl}/upload/${imagen.filename}`;

      const createdImagen = await this.imagenesService.createImagenMenu(
        menuId,
        imageUrl,
      );

      return createdImagen;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Auth({
    resource: AppResources.imagenes,
    action: 'create',
    possession: 'any',
  })
  @Post('testimony/:testimonyId')
  @UseInterceptors(
    FileInterceptor('imagen', {
      storage: diskStorage({
        destination: './upload',
        filename: renameImage,
      }),
    }),
  )
  async createImagenTestimony(
    @UploadedFile() imagen: Express.Multer.File,
    @Param('testimonyId') testimonyId: number,
  ) {
    try {
      //
      const baseUrl = 'https://api-turing.onrender.com';
      const imageUrl = `${baseUrl}/upload/${imagen.filename}`;

      const createdImagen = await this.imagenesService.createImagenTestimony(
        testimonyId,
        imageUrl,
      );

      return createdImagen;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Auth({
    resource: AppResources.imagenes,
    action: 'create',
    possession: 'own',
  })
  // Controlador que elimina una imagen
  @Delete(':id')
  async deleteImagen(@Param('id') id: number) {
    try {
      const imagen = await this.imagenesService.findOneImagen(id);

      if (!imagen) {
        throw new NotFoundException('Imagen no encontrada');
      }

      await this.imagenesService.deleteImagen(id);

      return { message: 'Imagen eliminada correctamente' };
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
}
