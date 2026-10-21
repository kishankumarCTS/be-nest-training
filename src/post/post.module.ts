import { forwardRef, Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { UserModule } from '../user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import Redis from 'ioredis';
import { BullModule } from '@nestjs/bullmq';
import { NotificationsProcessor } from './post.notification';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'notifications',
    }),
    TypeOrmModule.forFeature([Post, User]),
    forwardRef(() => UserModule),
  ],
  controllers: [PostController],
  providers: [
    PostService,
    NotificationsProcessor,
    {
      provide: 'REDIS_CACHE',
      useFactory: (): Redis => {
        return new Redis({ host: 'localhost', port: 6379 });
      },
    },
  ],
  exports: [PostService],
})
export class PostModule {}
