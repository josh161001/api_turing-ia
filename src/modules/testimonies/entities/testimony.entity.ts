import { Imagene } from 'src/modules/imagenes/entities/imagene.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('testimonies')
export class Testimony {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255, nullable: false })
  name: string;

  @Column({ type: 'text', nullable: false })
  description: string;

  @OneToOne(() => Imagene, (imagene) => imagene.testimony, {
    eager: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'imagen_id' })
  imagenes: Imagene;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
