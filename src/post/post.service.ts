/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Post } from './entities/post.entity';
import { User } from '../user/entities/user.entity';
import Redis from 'ioredis';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @Inject('REDIS_CACHE') private readonly redis: Redis,
  ) {}

  // CREATE
  async create(title: string, content: string, userId: number): Promise<Post> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const post = this.postRepository.create({
      title,
      content,
      user,
    });

    return this.postRepository.save(post);
  }

  // GET ALL
  async getPosts(): Promise<Post[]> {
    return this.postRepository.find({
      relations: ['user'],
      order: {
        createdAt: 'DESC',
      },
    });
  }

  // GET ONE
  async getPost(id: number): Promise<Post> {
    const cacheKey = `blogs:post:${id}`;
    const cachedPost = await this.redis.get(cacheKey);

    if (cachedPost) {
      console.log(`⚡ Cache HIT for post ID: ${id}`);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return JSON.parse(cachedPost);
    }
    console.log(`🐢 Cache MISS for post ID: ${id}. Fetching from DB...`);
    const post = await this.postRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!post) {
      throw new NotFoundException(`Post with id ${id} not found`);
    }
    await this.redis.set(cacheKey, JSON.stringify(post), 'EX', 60);

    return post;
  }

  // UPDATE
  async update(id: number, title?: string, content?: string): Promise<Post> {
    const post = await this.getPost(id);

    if (title !== undefined) {
      post.title = title;
    }

    if (content !== undefined) {
      post.content = content;
    }

    const cacheKey = `blogs:post:${id}`;
    await this.redis.del(cacheKey);
    console.log(`🗑️ Cache invalidated (deleted) for updated post ID: ${id}`);

    return this.postRepository.save(post);
  }

  // DELETE
  async remove(id: number): Promise<string> {
    const post = await this.getPost(id);
    const cacheKey = `blogs:post:${id}`;
    await this.redis.del(cacheKey);
    console.log(`🗑️ Cache invalidated (deleted) for deleted post ID: ${id}`);
    await this.postRepository.remove(post);
    return 'Post deleted';
  }
}
