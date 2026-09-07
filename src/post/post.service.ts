import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Post } from './entities/post.entity';
import { User } from '../user/entities/user.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
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
    const post = await this.postRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!post) {
      throw new NotFoundException(`Post with id ${id} not found`);
    }

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

    return this.postRepository.save(post);
  }

  // DELETE
  async remove(id: number): Promise<void> {
    const post = await this.getPost(id);

    await this.postRepository.remove(post);
  }
}
