import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { hash } from 'bcrypt';
import { v4 } from 'uuid';

import { MailerService } from '@nestjs-modules/mailer';

import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

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
    private readonly MailerService: MailerService,
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

    await this.sendVerification(email);

    return newUser;
  }

  // servicio para devolver todos los usuarios
  async findAllUsers(): Promise<User[]> {
    const users = await this.userRepository.find({ relations: ['imagenes'] });

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

  // servicio para enviarCorreo de confirmación
  async sendVerification(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new NotFoundException('El usuario no existe');
    }

    // crea un token para el usuario
    user.token = v4();

    await this.userRepository.save(user);

    const url = `http://localhost:3000/verify/${user.token}`;

    const mailContent = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <title>Confirmar correo</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 0;
          background-color: #f4f4f4;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #fff;
          border-radius: 10px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          text-align: center;
        }
        .header {
          margin-bottom: 20px;
        }
        .header h1 {
          color: #333;
        }
        .content {
          margin-bottom: 30px;
          color: #333;
        }
        .content p {
          font-size: 18px;
          margin-bottom: 10px;
        }
        .content a {
          display: inline-block;
          padding: 10px 20px;
          background-color: #1B396A;
          color: #fff;
          text-decoration: none;
          border-radius: 5px;
          font-size: 16px;
        }
        .footer {
          color: #555;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Confirma tu correo</h1>
        </div>
        <div class="content">
          <p>Hola <strong>${user.name}</strong>,</p>
          <p>Hemos recibido una solicitud para registrase. Si no lo has solicitado
          ignora este mensaje. De lo contrario haz clic en el siguiente botón para continuar:</p>
          <a href="${url}">Confirmar correo</a>
        </div>
        <div class="footer">
          <p>Este es un mensaje automatizado, por favor no responda.</p>
        </div>
      </div>
    </body>
    </html>    
    `;

    await this.MailerService.sendMail({
      to: user.email,
      subject: 'Confirma tu correo',
      html: mailContent,
    });
  }

  // servicio para verificar el token
  async verifyToken(token: string) {
    const user = await this.userRepository.findOne({ where: { token } });

    if (!user) {
      throw new NotFoundException('El usuario no existe');
    }

    user.status = true;
    user.token = null;

    await this.userRepository.save(user);

    return {
      message: 'Correo confirmado',
    };
  }
}
