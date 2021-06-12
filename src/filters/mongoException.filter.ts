import { MongoError } from "mongodb";
import { Response } from "express";
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from "@nestjs/common";

@Catch(MongoError)
export class MongoExceptionFilter implements ExceptionFilter {
  catch(error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const httpResult = {
      data: {
        statusCode: HttpStatus.BAD_REQUEST,
        message: "Bad Request",
      } as any,
    };

    switch (error.code) {
      case 11000: {
        httpResult.data = {
          statusCode: HttpStatus.CONFLICT,
          messages: Object.entries(error.keyValue).map(
            ([key, value]) => `${key}: '${value}' already exists.`,
          ),
        };
      }
    }

    response.status(httpResult.data.statusCode).json(httpResult.data);
  }
}
