import { Injectable, NotFoundException } from '@nestjs/common';
import { Comment } from './entities/comment.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from 'src/post/entities/post.entity';
import { AddCommentDto } from './dto/comment.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}
  async addComment(addCommentDto: AddCommentDto) {
    const post = await this.postRepository.findBy({
      id: addCommentDto.post_id,
    });
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    const newComment = this.commentRepository.create({
      content: addCommentDto.content,
    });
    const savedComment = await this.commentRepository.save(newComment);
    return savedComment;
  }
}
