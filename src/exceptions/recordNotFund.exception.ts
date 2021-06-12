import { HttpException, HttpStatus } from "@nestjs/common";

export class RecordNotFoundException extends HttpException {
  constructor(record: string) {
    super(
      `Record: '${record}' not found or non existent`,
      HttpStatus.NOT_FOUND,
    );
  }
}
