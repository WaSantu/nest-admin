import { Body, Injectable, ValidationPipe } from "@nestjs/common";
import { InjectModel } from "nestjs-typegoose";
import { Comment, CommentDocument } from "../../core/dbsupport/model/comment/comment.model";
import { ModelType } from "@typegoose/typegoose/lib/types";
import { CommentDto } from "./comment-dto";

@Injectable()
export class CommentService {
	constructor(
	  @InjectModel(Comment) private readonly comment:ModelType<CommentDocument>
	) {
	}
	add(request:CommentDto){
		this.comment.create({
			artical_id:request.artical_id,
			user_id:request.$$user._id,
			content:request.content,
			status:true,
		})
	}
}
