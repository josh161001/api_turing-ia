import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/common/decorator/auth.decorator';
import { AppResources } from 'src/app.roles';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from 'src/common/decorator/user.decorator';
import { User as UserEntity } from './entities/user.entity';
import { InjectRolesBuilder, RolesBuilder } from 'nest-access-control';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    @InjectRolesBuilder()
    private readonly rolesBuilder: RolesBuilder,
  ) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.createUser(createUserDto);

    return {
      message: 'Usuario creado',
      data: user,
    };
  }

  @Auth({
    resource: AppResources.users,
    action: 'read',
    possession: 'own',
  })
  @Get()
  async findAll() {
    const users = await this.usersService.findAllUsers();

    return {
      message: 'Lista de usuarios',
      data: users,
    };
  }

  @Auth({
    resource: AppResources.users,
    action: 'update',
    possession: 'own',
  })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @User() user: UserEntity,
  ) {
    let data;

    // verifica si el usuario tiene el rol de actualizar cualquier usuario
    if (
      this.rolesBuilder.can(user.roles).updateAny(AppResources.users).granted
    ) {
      data = await this.usersService.updateUser(id, updateUserDto);
    } else {
      data = await this.usersService.updateUser(id, updateUserDto, user);
    }
    return {
      message: 'Usuario actualizado',
      data,
    };
  }

  @Auth()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOneUserId(id);

    return {
      message: 'Usuario encontrado',
      data: user,
    };
  }

  @Auth({
    resource: AppResources.users,
    action: 'delete',
    possession: 'own',
  })
  @Delete(':id')
  async delete(@Param('id') id: string, @User() user: UserEntity) {
    let data;
    // verifica si el usuario tiene el rol de eliminar cualquier usuario
    if (
      this.rolesBuilder.can(user.roles).deleteAny(AppResources.users).granted
    ) {
      data = await this.usersService.deleteUser(id);
    } else {
      data = await this.usersService.deleteUser(id, user);
    }

    return {
      message: 'Usuario eliminado',
      data,
    };
  }

  @Get('verification/:token')
  async verification(@Param('token') token: string) {
    const user = await this.usersService.verifyToken(token);

    if (!user) {
      throw new NotFoundException('El token no existe');
    }

    return {
      message: 'Usuario verificado',
      data: user,
    };
  }
}
