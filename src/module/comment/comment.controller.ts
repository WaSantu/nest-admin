import { Body, Post, UseGuards, UseInterceptors, ValidationPipe } from "@nestjs/common";
import { Controller } from '@nestjs/common';
import { CommentDto } from "./comment-dto";
import { CommentService } from "./comment.service";
import { AuthGuard } from "@nestjs/passport";
import { AddUserInterceptor } from "../../interceptor/user.interceptor";

@Controller('comment')
export class CommentController {
	constructor(
	  private readonly commentservice:CommentService
	) {
	}
	@Post('/add')
	@UseGuards(AuthGuard('jwt'))
	@UseInterceptors(AddUserInterceptor)
	add(@Body(new ValidationPipe()) request:CommentDto){
		return this.commentservice.add(request)
	}
}
