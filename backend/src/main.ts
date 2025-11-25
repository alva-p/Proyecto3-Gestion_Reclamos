import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Habilitar CORS para el frontend
  app.enableCors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true,
  });
  
  await app.listen(process.env.PORT ?? 3001);
  console.log(`Backend is running on: http://localhost:${process.env.PORT ?? 3001}`);
}
bootstrap();
