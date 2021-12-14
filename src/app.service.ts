import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    const currentDateTime = new Date().getTime();
    return `${currentDateTime}`;
  }
}