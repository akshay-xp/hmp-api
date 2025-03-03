import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = app.get(ConfigService);
  const port = config.get<number>('PORT');
  const webUrl = config.get<string>('WEB_URL');

  // set security HTTP headers
  app.use(helmet());

  // enable CORS
  app.enableCors({
    origin: webUrl,
    credentials: true,
  });

  // handle cookies
  app.use(cookieParser());

  // handle validation
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );

  await app.listen(port ?? 3000);
}
void bootstrap();
