import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEmailDto } from './dto/create-email.dto';
import { UpdateEmailDto } from './dto/update-email.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { v4 } from 'uuid';

@Injectable()
export class EmailService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly mailerService: MailerService,
  ) {}

  // servicio para enviarCorreo de confirmación
  async sendVerification(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new NotFoundException('El usuario no existe');
    }

    // crea un token para el usuario
    user.token = v4();

    await this.userRepository.save(user);

    const url = `https://applicationfront.onrender.com/#/verificar-cuenta/${user.token}`;

    await this.sendEmail(user, 'Verificar cuenta', url, 'Verificar la cuenta');
  }

  //servicio para verificar el token

  async emailRecuperation(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new NotFoundException('El usuario no existe');
    }

    user.token = v4();

    await this.userRepository.save(user);

    const url = `https://applicationfront.onrender.com/#/recuperar-cuenta/${user.token}`;

    await this.sendEmail(
      user,
      'Recuperar contraseña',
      url,
      'Recuperar la cuenta',
    );
  }

  async sendEmail(user: User, subject: string, url: string, text: string) {
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
          <h1>${text}</h1>
        </div>
        <div class="content">
          <p>Hola <strong>${user.name}</strong>,</p>
          <p>Hemos recibido una solicitud para ${text}. Si no lo has solicitado
          ignora este mensaje. De lo contrario haz clic en el siguiente botón para continuar:</p>
          <a href="${url}">${text}</a>
        </div>
        <div class="footer">
          <p>Este es un mensaje automatizado, por favor no responda.</p>
        </div>
      </div>
    </body>
    </html>    
    `;

    await this.mailerService.sendMail({
      to: user.email,
      subject: subject,
      html: mailContent,
    });
  }
}
