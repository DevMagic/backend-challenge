import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: function (configService: ConfigService): {} {
        return {
          type: 'postgres',
          host: configService.get('TYPEORM_HOST'),
          port: configService.get('TYPEORM_PORT'),
          username: configService.get('TYPEORM_USERNAME'),
          password: configService.get('TYPEORM_PASSWORD'),
          database: configService.get('TYPEORM_DATABASE'),
          entities: [__dirname + '/../**/*.entity.{js,ts}'],
          migrations: [__dirname + '/migration/*.{js,ts}'],
          cli: {
            migrationsDir: __dirname + '/migration/',
          },
          synchronize: true,
        };
      },
    }),
  ],
})
export class DatabaseModule {}
