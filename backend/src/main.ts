import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for mobile app and web access
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidUnknownValues: false,
    }),
  );

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 4000;

  await app.listen(port);
  console.log(`=======================================================`);
  console.log(` Hemabridge NestJS Monolith is running on port: ${port}`);
  console.log(` HTTP API Base URL: http://localhost:${port}`);
  console.log(` WebSocket Gateway: ws://localhost:${port}`);
  console.log(`=======================================================`);
}

bootstrap();
