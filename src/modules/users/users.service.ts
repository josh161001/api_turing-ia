import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { compare, hash } from 'bcrypt';
import { v4 } from 'uuid';

import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdatePasswordUserDto } from './dto/updatePassword-user';

// Se define la interfaz para la búsqueda de usuarios
export interface UserFindOne {
  id?: string;
  email?: string;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // servicio para crear un usuario en la base de datos
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { name, email, password } = createUserDto;

    // Verifica que los campos no estén vacíos
    const trimName = name.trim();
    const trimEmail = email.trim();
    const trimPassword = password.trim();

    if (
      trimName.length === 0 ||
      trimEmail.length === 0 ||
      trimPassword.length === 0
    ) {
      throw new BadRequestException('Los campos no pueden estar vacíos');
    }

    // busca si el email ya existe
    const emailExists = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (emailExists) {
      throw new BadRequestException('El email ya existe');
    }

    // crea el objeto del usuario con los datos del DTO
    const user = this.userRepository.create(createUserDto);

    // encripta la contraseña y la guarda en el usuario
    const newUser = this.userRepository.save({
      ...user,
      password: await hash(createUserDto.password, 10),
    });

    delete (await newUser).password;

    return newUser;
  }

  // servicio para devolver todos los usuarios
  async findAllUsers(): Promise<User[]> {
    const users = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.imagenes', 'imagenes')
      .addSelect(['imagenes.id', 'imagenes.url_imagen'])
      .getMany();

    users.map((user) => {
      delete user.password;
    });

    return users;
  }

  // servicio para buscar un usuario por id
  async findOneUserId(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['imagenes'],
    });

    if (!user) {
      throw new BadRequestException('El usuario no existe');
    }

    delete user.password;

    return user;
  }

  //servicio para obtener un usuario por id y verificar si es el mismo usuario que hace la petición
  async getOneId(id: string, userEntity?: User): Promise<User> {
    const user = await this.userRepository
      .findOne({ where: { id } })
      .then((user) =>
        !userEntity ? user : !!user && userEntity.id === user.id ? user : null,
      );

    if (!user) {
      throw new ForbiddenException('Usuarno no autorizado');
    }

    delete user.password;

    return user;
  }

  // servicio para buscar un usuario por email o id
  async findOneUser(data: UserFindOne): Promise<User> {
    return await this.userRepository
      .createQueryBuilder('user')
      .where(data)
      .addSelect('user.password')
      .getOne();
  }

  // servicio para actualizar un usuario
  async updateUser(
    id: string,
    updateUserDto: UpdateUserDto,
    userEntity?: User,
  ): Promise<User> {
    const user = await this.getOneId(id, userEntity);

    if (!user) {
      throw new NotFoundException('El usuario no existe');
    }

    Object.assign(user, updateUserDto);

    const { password, ...rest } = user;

    return await this.userRepository.save(rest);
  }

  // servicio para eliminar un usuario
  async deleteUser(id: string, userEntity?: User) {
    const user = await this.getOneId(id, userEntity);

    if (!user) {
      throw new NotFoundException('El usuario no encontrado');
    }

    await this.userRepository.delete(id);
  }

  // servicio para verificar el token
  async verifyToken(token: string) {
    const user = await this.userRepository.findOne({ where: { token } });

    if (!user) {
      throw new NotFoundException('Token no valido');
    }

    user.status = true;
    user.token = null;

    await this.userRepository.save(user);

    return {
      message: 'Correo confirmado',
    };
  }

  async verifytokenRecovery(token: string) {
    const user = await this.userRepository.findOne({ where: { token } });

    if (!user) {
      throw new NotFoundException('El token no existe');
    }

    delete user.password;

    return user;
  }

  // servicio para actualizar password
  async updatePassword(token: string, updatePassword: UpdatePasswordUserDto) {
    const user = await this.userRepository.findOne({ where: { token } });

    if (user.token !== token) {
      throw new ForbiddenException('Token no válido');
    }

    user.password = await hash(updatePassword.password, 10);
    user.token = null;

    await this.userRepository.save(user);
  }
}
