import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { ValidationPipe } from '@nestjs/common';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,              // Ignora campos que no estén en el DTO
      forbidNonWhitelisted: true,   // Lanza error si mandan campos de más
      transform: true,              // Transforma tipos primitivos
    }),
  );
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log('\n===============================================');
  console.log('🚀 Servidor levantado correctamente');
  console.log(`🌐 Backend corriendo en: http://localhost:${port}`);
  console.log(`🩺 Health check disponible en: http://localhost:${port}/health`);
  console.log('===============================================\n');
}
bootstrap();
