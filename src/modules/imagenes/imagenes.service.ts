import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Imagene } from './entities/imagene.entity';
import { User } from '../users/entities/user.entity';
import { Menu } from '../menu/entities/menu.entity';
import { Testimony } from '../testimonies/entities/testimony.entity';

import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ImagenesService {
  constructor(
    @InjectRepository(Imagene)
    private readonly imageneRepository: Repository<Imagene>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Menu)
    private readonly menuRepository: Repository<Menu>,
    @InjectRepository(Testimony)
    private readonly testimonyRepository: Repository<Testimony>,
  ) {}

  // servicio que crea una imagen para un usuario
  async createImagenUser(userId: string, imageUrl: string): Promise<Imagene> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    delete user.password;
    delete user.email;

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // si el usuario ya tiene una imagen se elimina
    // se busca la imagen en la carpeta upload y se elimina
    if (user.imagenes) {
      await this.deleteFileUpload(user.imagenes.url_imagen);
      await this.imageneRepository.delete(user.imagenes.id);
    }

    // se crea una nueva imagen con la url de la imagen y el usuario
    const newImagen = this.imageneRepository.create({
      url_imagen: imageUrl,
      user: user,
    });

    const savedImagen = await this.imageneRepository.save(newImagen);

    // se agrega la imagen al usuario
    user.imagenes = savedImagen;
    await this.userRepository.save(user);

    return savedImagen;
  }

  // servicio que crea una imagen para menu
  async createImagenMenu(menuId: number, imageUrl: string): Promise<Imagene> {
    const menu = await this.menuRepository.findOne({ where: { id: menuId } });

    if (!menu) {
      throw new NotFoundException('Menu no encontrado');
    }

    // si el menu ya tiene una imagen se elimina
    // se busca la imagen en la carpeta upload y se elimina
    if (menu.imagenes) {
      await this.deleteFileUpload(menu.imagenes.url_imagen);
      await this.imageneRepository.delete(menu.imagenes.id);
    }

    // se crea una nueva imagen con la url de la imagen y el menu
    const newImagen = this.imageneRepository.create({
      url_imagen: imageUrl,
      menu: menu,
    });

    const savedImagen = await this.imageneRepository.save(newImagen);

    // se agrega la imagen al menu
    menu.imagenes = savedImagen;
    await this.menuRepository.save(menu);

    return savedImagen;
  }

  async createImagenTestimony(
    testimonyId: number,
    imageUrl: string,
  ): Promise<Imagene> {
    const testimony = await this.testimonyRepository.findOne({
      where: { id: testimonyId },
    });

    if (!testimony) {
      throw new NotFoundException('Testimonio no encontrado');
    }

    // si el testimonio ya tiene una imagen se elimina
    // se busca la imagen en la carpeta upload y se elimina
    if (testimony.imagenes) {
      await this.deleteFileUpload(testimony.imagenes.url_imagen);
      await this.imageneRepository.delete(testimony.imagenes.id);
    }

    // se crea una nueva imagen con la url de la imagen y el testimonio
    const newImagen = this.imageneRepository.create({
      url_imagen: imageUrl,
      testimony: testimony,
    });

    const savedImagen = await this.imageneRepository.save(newImagen);

    // se agrega la imagen al testimonio
    testimony.imagenes = savedImagen;
    await this.testimonyRepository.save(testimony);

    return savedImagen;
  }

  // servicio que elimina una imagen
  async deleteImagen(id: number) {
    const imagen = await this.imageneRepository.findOne({ where: { id } });

    if (!imagen) {
      throw new NotFoundException('Imagen no encontrada');
    }

    await this.deleteFileUpload(imagen.url_imagen);

    await this.imageneRepository.delete(id);
  }

  // servicio que elimina una imagen de la carpeta upload
  async deleteFileUpload(imageUrl: string): Promise<void> {
    if (!imageUrl) {
      return;
    }

    const imageName = imageUrl.split('/').pop();
    const path = `./upload/${imageName}`;

    try {
      if (fs.existsSync(path)) {
        await fs.promises.unlink(path);
      }
    } catch (error) {
      throw new BadRequestException('Error al eliminar la imagen');
    }
  }

  async findOneImagen(id: number) {
    const imagen = await this.imageneRepository.findOne({ where: { id } });

    if (!imagen) {
      throw new NotFoundException('Imagen no encontrada');
    }

    return imagen;
  }
}
