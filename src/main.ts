import { ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { AllExceptionsFilter } from './all-exceptions.filter';
import { AppModule } from './app.module';

async function bootstrap() {
  const port = parseInt(process.env.PORT, 10);
  const app = await NestFactory.create(AppModule);
  const { httpAdapter } = app.get(HttpAdapterHost);
  const config = new DocumentBuilder()
    .setTitle('Ultra.io Games API')
    .setDescription('Test API')
    .setVersion('1.0')
    .addTag('games')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(port, () => {
    console.log('Application running at port' + port);
  });
}
bootstrap();
