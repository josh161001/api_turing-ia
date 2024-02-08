import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/common/decorator/auth.decorator';
import { AppResources } from 'src/app.roles';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Auth({
    resource: AppResources.categories,
    action: 'create',
    possession: 'any',
  })
  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    const category =
      await this.categoriesService.createCategory(createCategoryDto);

    return {
      message: 'Categoría creada',
      category,
    };
  }

  @Auth({
    resource: AppResources.categories,
    action: 'read',
    possession: 'own',
  })
  @Get()
  async findAll() {
    const categories = await this.categoriesService.findAllCategories();

    return {
      message: 'Lista de categorías',
      categories,
    };
  }

  @Auth({
    resource: AppResources.categories,
    action: 'read',
    possession: 'own',
  })
  @Get(':id')
  async findOne(@Param('id') id: number) {
    const category = await this.categoriesService.findOneCategory(id);

    return {
      message: 'Categoría encontrada',
      category,
    };
  }

  @Auth({
    resource: AppResources.categories,
    action: 'update',
    possession: 'any',
  })
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    const category = await this.categoriesService.updateCategory(
      id,
      updateCategoryDto,
    );

    return {
      message: 'Categoría actualizada',
      category,
    };
  }

  @Auth({
    resource: AppResources.categories,
    action: 'delete',
    possession: 'any',
  })
  @Delete(':id')
  async delete(@Param('id') id: number) {
    const category = await this.categoriesService.deleteCategory(id);

    return {
      message: 'Categoría eliminada',
      category,
    };
  }
}
