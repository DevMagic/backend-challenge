import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerDocumentOptions, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
import { WinstonModule } from 'nest-winston';
import { AppModule } from './app.module';
import { winstonConfig } from './configs/winston.config';

dotenv.config();

async function bootstrap() {
  const logger = WinstonModule.createLogger(winstonConfig);
  const app = await NestFactory.create(AppModule, { logger });
  const config = new DocumentBuilder()
    .setTitle('The DevMagic API')
    .setDescription('API Rest able to register, search, update and delete players, using queries to Api from Riot Games to bring the data of the players that will be registered in a database.')
    .setVersion('1.0')
    .build();
  const options: SwaggerDocumentOptions = {
    operationIdFactory: (_controllerKey: string, methodKey: string) => methodKey,
  };
  const document = SwaggerModule.createDocument(app, config, options);
  SwaggerModule.setup('api', app, document);
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
