import { IsBoolean, IsNotEmpty } from "class-validator";
import { mongoose } from "@typegoose/typegoose";


interface userInterface {
	_id: mongoose.Types.ObjectId
	name:string,
	pwd:string
}

class CommentDto {
	@IsNotEmpty({message:'请选择评论文章'})
	artical_id:mongoose.Types.ObjectId
	@IsNotEmpty({message:'请填写评论内容'})
	content:string
	replay_comment_id:mongoose.Types.ObjectId
	readonly $$user:userInterface
}

export  {
	CommentDto
}
