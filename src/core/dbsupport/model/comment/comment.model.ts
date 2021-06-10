import { modelOptions, Prop, prop, Ref } from "@typegoose/typegoose";
import { Document } from "mongoose";
import { User } from "../user/user.model";
import { Artical } from "../artical/artical.model";
@modelOptions({
	schemaOptions:{
		versionKey:false,
		timestamps:{
			createdAt:true,
			updatedAt:true
		}
	},
})
export class Comment{
	@prop()
	content:string
	@prop()
	status:boolean
	@Prop({ref:()=>User})
	user_id:Ref<User>
	@Prop({ref:()=>Comment})
	reply_comment_id:Ref<Comment>
	@Prop({ref:()=>Artical})
	artical_id:Ref<Artical>
}
export type CommentDocument = Comment & Document