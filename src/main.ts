import { UnprocessableEntityException, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

import { MongoExceptionFilter } from "./filters/mongoException.filter";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new MongoExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      exceptionFactory: (errors) => {
        throw new UnprocessableEntityException({
          messages: errors
            .map(({ constraints }) => Object.values(constraints))
            .reduce((prev, curr) => [...prev, ...curr], []),
        });
      },
    }),
  );

  await app.listen(3000);
}
bootstrap();
