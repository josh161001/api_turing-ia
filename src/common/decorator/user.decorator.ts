import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// decorador para obtener el usuario autenticado en la petición
export const User = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    // se obtiene la peticion de la solicitud
    const request = ctx.switchToHttp().getRequest();

    // se obtiene el usuario autenticado
    const user = request.user;

    return data ? user?.[data] : user;
  },
);
