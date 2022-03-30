import { Injectable } from '@nestjs/common';
import * as jose from "jose";




@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}

