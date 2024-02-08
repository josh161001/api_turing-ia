import {
  Body,
  Controller,
  Get,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login-auth.dto';
import { User } from 'src/common/decorator/user.decorator';
import { User as UserEntity } from '../users/entities/user.entity';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { JwtAuthGuard } from './guard/jwt-auth.guard';

@ApiTags('auth')
@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // se inicia sesión con las credenciales del usuario
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() loginDto: LoginDto, @User() user: UserEntity) {
    try {
      const data = await this.authService.login(user);

      return {
        data,
        message: 'Inicio de sesión exitoso',
      };
    } catch (error) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
  }

  // se obtiene el perfil del usuario autenticado
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async profile(@User() user: UserEntity) {
    // se oculta la contraseña del usuario
    const { password, ...rest } = user;

    return {
      data: rest,
      message: 'Token válido',
    };
  }
}
