import { Body, Controller, Post } from '@nestjs/common';
import { CommentService } from './comment.service';
import { AddCommentDto } from './dto/comment.dto';
import { CommentGateway } from './comment.gateway';

@Controller('comment')
export class CommentController {
  constructor(
    private readonly commentService: CommentService,
    private readonly commentGateway: CommentGateway,
  ) {}

  @Post()
  async addComment(@Body() addCommentDto: AddCommentDto) {
    const newComment = await this.commentService.addComment(addCommentDto);
    this.commentGateway.handleMessageToRoom({
      comment: newComment.content,
      postId: newComment.id,
    });
    return newComment;
  }
}
