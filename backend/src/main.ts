import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { UsersService } from './controllers/v1/users/users.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.enableCors({
    origin: (process.env.CORS_ORIGINS || '*').split(',').map((s) => s.trim()).filter(Boolean),
    credentials: true,
    methods: ['GET','POST','PATCH','PUT','DELETE','OPTIONS'],
    allowedHeaders: ['Content-Type','Authorization'],
  });
  // seed super admin on boot
  const usersService = app.get(UsersService);
  await usersService.createSuperAdminIfMissing();
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
