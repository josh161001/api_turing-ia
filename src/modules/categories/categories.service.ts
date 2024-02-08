import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}
  async createCategory(createCategoryDto: CreateCategoryDto) {
    const nameCategory = await this.categoryRepository.findOne({
      where: { name: createCategoryDto.name },
    });

    if (nameCategory) {
      throw new BadRequestException('Categoria ya existe');
    }

    const category = this.categoryRepository.create(createCategoryDto);

    return this.categoryRepository.save(category);
  }

  async findAllCategories() {
    return this.categoryRepository.find();
  }

  async findOneCategory(id: number) {
    const category = await this.categoryRepository.findOne({ where: { id } });

    if (!category) {
      throw new BadRequestException('Categoria no existe');
    }
    return this.categoryRepository.findOne({ where: { id } });
  }

  async updateCategory(id: number, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.categoryRepository.findOne({ where: { id } });

    if (!category) {
      throw new BadRequestException('Categoria no existe');
    }

    return this.categoryRepository.update(id, updateCategoryDto);
  }

  async deleteCategory(id: number) {
    const category = await this.categoryRepository.findOne({ where: { id } });

    if (!category) {
      throw new BadRequestException('Categoria no existe');
    }

    return this.categoryRepository.delete(id);
  }
}
