import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';

@Injectable()
export class AppService implements OnModuleInit {
  private readonly logger = new Logger(AppService.name);

  constructor(
    @Inject('APP_CONFIG')
    private readonly appConfig: {
      dbName: string;
      host: string;
      jwtSecret: string;
    },
  ) {}

  onModuleInit() {
    this.logger.log('=============== ROOT CONFIG INITIALIZED ===============');
    this.logger.log(`Target Database: ${this.appConfig.dbName}`);
    this.logger.log(`Database Host:   ${this.appConfig.host}`);
    this.logger.log(
      `JWT Status:      ${this.appConfig.jwtSecret ? 'Active ✅' : 'Missing ❌'}`,
    );
    this.logger.log('=======================================================');
  }

  getHello(): string {
    return 'Hello World!';
  }
}
