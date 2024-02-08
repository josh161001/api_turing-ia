import { Menu } from 'src/modules/menu/entities/menu.entity';
import { Testimony } from 'src/modules/testimonies/entities/testimony.entity';
import { User } from 'src/modules/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('imagenes')
export class Imagene {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255, nullable: false })
  url_imagen: string;

  @OneToOne(() => Menu, (menu) => menu.imagenes, {
    onDelete: 'SET NULL',
  })
  menu: Menu;

  @OneToOne(() => User, (user) => user.imagenes, {
    onDelete: 'SET NULL',
  })
  user: User;

  @OneToOne(() => Testimony, (testimony) => testimony.imagenes, {
    onDelete: 'SET NULL',
  })
  testimony: Testimony;

  @UpdateDateColumn()
  updatedAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
