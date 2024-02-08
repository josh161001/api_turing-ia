import { Injectable } from '@nestjs/common';
import { CreateTestimonyDto } from './dto/create-testimony.dto';
import { UpdateTestimonyDto } from './dto/update-testimony.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Testimony } from './entities/testimony.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TestimoniesService {
  constructor(
    @InjectRepository(Testimony)
    private testimonyRepository: Repository<Testimony>,
  ) {}

  async createTestimony(createTestimonyDto: CreateTestimonyDto) {
    const testimony = this.testimonyRepository.create(createTestimonyDto);
    return this.testimonyRepository.save(testimony);
  }

  async findAllTestimonies() {
    return this.testimonyRepository.find();
  }

  async findOneTestimony(id: number) {
    return this.testimonyRepository.findOne({ where: { id } });
  }

  async updateTestimony(id: number, updateTestimonyDto: UpdateTestimonyDto) {
    return this.testimonyRepository.update(id, updateTestimonyDto);
  }

  async deleteTestimony(id: number) {
    return this.testimonyRepository.delete(id);
  }
}
