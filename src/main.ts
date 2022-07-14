import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      disableErrorMessages: process.env.APP_ENV === 'production',
    }),
  );
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  if (process.env.APP_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle(process.env.npm_package_name)
      .setVersion(process.env.npm_package_version)
      .addBearerAuth({
        type: 'http',
        in: 'header',
        description: '**Authentication for users**',
      })
      .addApiKey(
        {
          type: 'apiKey',
          name: 'key',
          in: 'query',
          description: '**Authentication for applications**',
        },
        'apiKey',
      )
      .addTag('auth')
      .addTag('users')
      .addTag('locations')
      .addTag('temperatures')
      .addTag('humidities')
      .addTag('decisions')
      .addTag('applications-temperatures')
      .addTag('applications-humidities')
      .addTag('applications-decisions')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('/', app, document);
  }

  await app.listen(process.env.PORT);
}
bootstrap();
