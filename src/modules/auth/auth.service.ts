import { Injectable } from '@nestjs/common';

import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

import { User } from '../users/entities/user.entity';

import { compare } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  // valida el usuario mediante el email
  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userService.findOneUser({ email });

    //compara la contraseña encriptada con la contraseña ingresada
    if (user && (await compare(pass, user.password))) {
      const { password, ...result } = user;

      return result;
    }

    return null;
  }

  // login del usuario y devuelve el token de acceso
  async login(user: User) {
    const { id, password, ...rest } = user;
    const payload = { sub: id };

    return {
      ...rest,
      access_token: this.jwtService.sign(payload),
    };
  }
}
