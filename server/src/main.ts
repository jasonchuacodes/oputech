import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { corsMiddleware } from './common/middleware/cors.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.use(corsMiddleware());
  app.setGlobalPrefix('api');

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
