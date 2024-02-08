import { Module } from '@nestjs/common';
import { TestimoniesService } from './testimonies.service';
import { TestimoniesController } from './testimonies.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Testimony } from './entities/testimony.entity';
import { Imagene } from '../imagenes/entities/imagene.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Testimony, Imagene])],
  controllers: [TestimoniesController],
  providers: [TestimoniesService],
})
export class TestimoniesModule {}
