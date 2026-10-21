/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class AddCommentDto {
  @IsNumber()
  @IsNotEmpty()
  postId!: number;

  @IsNumber()
  @IsNotEmpty()
  user_id!: number;

  @IsNumber()
  @IsNotEmpty()
  post_id!: number;

  @IsString()
  @IsNotEmpty()
  content!: string;
}
