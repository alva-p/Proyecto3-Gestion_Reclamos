import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log('\n===============================================');
  console.log('🚀 Servidor levantado correctamente');
  console.log(`🌐 Backend corriendo en: http://localhost:${port}`);
  console.log(`🩺 Health check disponible en: http://localhost:${port}/health`);
  console.log('===============================================\n');
}
bootstrap();
