import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as path from 'path';
import * as express from 'express';
import { hash } from 'bcrypt';
import { User } from './modules/users/entities/user.entity';
import { DataSource } from 'typeorm';
import { AppResources, AppRoles } from './app.roles';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const dataSource = app.get(DataSource);
  const userRepository = dataSource.getRepository(User);

  // Habilita CORS para permitir solicitudes desde diferentes dominios
  app.enableCors({});

  // logica para crear un usuario por defecto
  const defaultUser = {
    name: 'admin',
    email: 'admin@gmail.com',
    password: await hash('admin12345', 10),
    status: true,
    roles: [AppRoles.ADMIN],
  };

  const existingUser = await userRepository.findOne({
    where: { email: defaultUser.email },
  });

  if (!existingUser) {
    await userRepository.save(userRepository.create(defaultUser));
  }

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('NestJS API Turing-IA')
    .setDescription('API para el proyecto de Turing-IA PRUEBA TÉCNICA')
    .setVersion('1.0')
    .addTag('API')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document, {
    customSiteTitle: 'NestJS API',
    explorer: true,
    swaggerOptions: {
      filter: true,
      showRequestDuration: true,
    },
  });

  // Ruta para archivos estáticos
  app.use('/upload', express.static(path.join(__dirname, '../../', 'upload')));

  // Inicia el servidor en el puerto especificado
  await app.listen(AppModule.port);
}

bootstrap();
