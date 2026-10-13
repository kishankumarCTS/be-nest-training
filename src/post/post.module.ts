import { forwardRef, Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { UserModule } from '../user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { User } from '../user/entities/user.entity';
import Redis from 'ioredis';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post, User]),
    forwardRef(() => UserModule),
  ],
  controllers: [PostController],
  providers: [
    PostService,
    {
      provide: 'REDIS_CACHE',
      useFactory: (): Redis => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        return new Redis({ host: 'localhost', port: 6379 });
      },
    },
  ],
})
export class PostModule {}
