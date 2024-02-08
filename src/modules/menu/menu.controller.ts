import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { MenuService } from './menu.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/common/decorator/auth.decorator';
import { AppResources } from 'src/app.roles';

@ApiTags('menu')
@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Auth({
    resource: AppResources.menu,
    action: 'create',
    possession: 'any',
  })
  @Post()
  async create(
    @Body() createMenuDto: CreateMenuDto,
    @Body('category_id') category_id: number,
  ) {
    const menu = await this.menuService.createMenu(createMenuDto, category_id);

    return {
      message: 'Menu creado',
      menu,
    };
  }

  @Auth({
    resource: AppResources.menu,
    action: 'read',
    possession: 'own',
  })
  @Get()
  async findAll() {
    const menu = await this.menuService.findAllMenu();

    return {
      message: 'Lista de menus',
      menu,
    };
  }

  @Auth({
    resource: AppResources.menu,
    action: 'read',
    possession: 'own',
  })
  @Get(':id')
  async findOne(@Param('id') id: number) {
    const menu = await this.menuService.findByIdMenu(id);

    return {
      message: 'Menu encontrado',
      menu,
    };
  }

  @Auth({
    resource: AppResources.menu,
    action: 'update',
    possession: 'any',
  })
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateMenuDto: UpdateMenuDto,
    @Body('category_id') category_id: number,
  ) {
    const menu = await this.menuService.updateMenu(
      id,
      updateMenuDto,
      category_id,
    );

    return {
      message: 'Menu actualizado',
      menu,
    };
  }

  @Auth({
    resource: AppResources.menu,
    action: 'delete',
    possession: 'any',
  })
  @Delete(':id')
  async delete(@Param('id') id: number) {
    const menu = await this.menuService.deleteMenu(id);

    return {
      message: 'Menu eliminado',
      menu,
    };
  }
}
