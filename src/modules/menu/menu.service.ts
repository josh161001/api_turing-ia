import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { Menu } from './entities/menu.entity';
import { Category } from '../categories/entities/category.entity';

import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Menu)
    private menuRepository: Repository<Menu>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  // servicio que crea un menu y lo asocia a una categoria
  async createMenu(
    createMenuDto: CreateMenuDto,
    category_id: number,
  ): Promise<Menu> {
    const category = await this.categoryRepository.findOne({
      where: { id: category_id },
    });

    if (!category) {
      throw new NotFoundException('Categoria no encontrada');
    }

    const menu = this.menuRepository.create({
      ...createMenuDto,
      categories: category,
    });

    return await this.menuRepository.save(menu);
  }

  // servicio que retorna todos los menus
  async findAllMenu(): Promise<Menu[]> {
    // se buscan los menus y se incluyen las relaciones con categorias e imagenes
    return await this.menuRepository.find({
      relations: ['categories', 'imagenes'],
    });
  }

  // servicio que retorna un menu por id
  async findByIdMenu(id: number): Promise<Menu> {
    // se busca el menu por id y se incluyen las relaciones con categorias e imagenes
    const menu = await this.menuRepository.findOne({
      where: { id },
      relations: ['categories', 'imagenes'],
    });

    if (!menu) {
      throw new NotFoundException('Menu no encontrado');
    }

    return menu;
  }

  // servicio que actualiza un menu
  async updateMenu(
    id: number,
    updateMenuDto: UpdateMenuDto,
    category_id: number,
  ): Promise<Menu> {
    const menu = await this.menuRepository.findOne({ where: { id } });

    if (!menu) {
      throw new NotFoundException('Menu no encontrado');
    }

    // se busca la categoria
    const category = await this.categoryRepository.findOne({
      where: { id: category_id },
    });

    if (!category) {
      throw new NotFoundException('Categoria no encontrada');
    }

    // se actualiza la categoria del menu
    menu.categories = category;

    // se actualizan los datos del menu
    Object.assign(menu, updateMenuDto);

    return await this.menuRepository.save(menu);
  }

  async deleteMenu(id: number) {
    const menu = await this.menuRepository.findOne({ where: { id } });

    if (!menu) {
      throw new NotFoundException('Menu no encontrado');
    }

    await this.menuRepository.delete(id);
  }
}
