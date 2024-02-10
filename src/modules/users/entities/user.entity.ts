import { AppRoles } from 'src/app.roles';
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

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255, nullable: false })
  name: string;

  @Column({ length: 255, nullable: false, unique: true })
  email: string;

  @Column({ length: 60, nullable: false })
  password: string;

  @Column({ type: 'boolean', default: false, nullable: false })
  status: boolean;

  @Column({ type: 'simple-array', nullable: false, default: AppRoles.USER })
  roles: string[];

  @Column({ nullable: true })
  token: string;

  @OneToOne(() => Imagene, (imagene) => imagene.user, {
    eager: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'imagen_id' })
  imagenes: Imagene;

  @UpdateDateColumn({})
  updatedAt: Date;

  @CreateDateColumn({})
  createdAt: Date;
}
