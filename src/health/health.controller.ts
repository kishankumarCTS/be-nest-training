import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get()
  getHello() {
    return { status: 'ok', timeStamp: new Date().toLocaleString() };
  }
}
