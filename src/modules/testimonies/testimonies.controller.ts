import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TestimoniesService } from './testimonies.service';
import { CreateTestimonyDto } from './dto/create-testimony.dto';
import { UpdateTestimonyDto } from './dto/update-testimony.dto';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/common/decorator/auth.decorator';
import { AppResources } from 'src/app.roles';

@ApiTags('testimonies')
@Controller('testimonies')
export class TestimoniesController {
  constructor(private readonly testimoniesService: TestimoniesService) {}

  @Auth({
    resource: AppResources.testimonies,
    action: 'create',
    possession: 'any',
  })
  @Post()
  async create(@Body() createTestimonyDto: CreateTestimonyDto) {
    const testimony =
      await this.testimoniesService.createTestimony(createTestimonyDto);

    return {
      message: 'Testimonio creado',
      testimony,
    };
  }

  @Auth({
    resource: AppResources.testimonies,
    action: 'read',
    possession: 'own',
  })
  @Get()
  async findAll() {
    const testimonies = await this.testimoniesService.findAllTestimonies();

    return {
      message: 'Lista de testimonios',
      testimonies,
    };
  }

  @Auth({
    resource: AppResources.testimonies,
    action: 'read',
    possession: 'own',
  })
  @Get(':id')
  async findOne(@Param('id') id: number) {
    const testimony = await this.testimoniesService.findOneTestimony(id);

    return {
      message: 'Testimonio encontrado',
      testimony,
    };
  }

  @Auth({
    resource: AppResources.testimonies,
    action: 'update',
    possession: 'any',
  })
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateTestimonyDto: UpdateTestimonyDto,
  ) {
    const testimony = await this.testimoniesService.updateTestimony(
      id,
      updateTestimonyDto,
    );

    return {
      message: 'Testimonio actualizado',
      testimony,
    };
  }

  @Auth({
    resource: AppResources.testimonies,
    action: 'delete',
    possession: 'any',
  })
  @Delete(':id')
  async remove(@Param('id') id: number) {
    const testimony = await this.testimoniesService.deleteTestimony(id);

    return {
      message: 'Testimonio eliminado',
      testimony,
    };
  }
}
