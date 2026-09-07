import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post as HttpPost,
} from '@nestjs/common';

import { PostService } from './post.service';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  // POST /posts
  @HttpPost()
  create(@Body() body: { title: string; content: string; userId: number }) {
    return this.postService.create(body.title, body.content, body.userId);
  }

  // GET /posts
  @Get()
  getPosts() {
    return this.postService.getPosts();
  }

  // GET /posts/:id
  @Get(':id')
  getPost(@Param('id', ParseIntPipe) id: number) {
    return this.postService.getPost(id);
  }

  // PATCH /posts/:id
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body()
    body: {
      title?: string;
      content?: string;
    },
  ) {
    return this.postService.update(id, body.title, body.content);
  }

  // DELETE /posts/:id
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.postService.remove(id);
  }
}
