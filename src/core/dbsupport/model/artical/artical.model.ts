import { modelOptions, Prop, prop, Ref } from "@typegoose/typegoose";
import {Document} from "mongoose";
import { Category } from "../category/category.model";
import { User } from "../user/user.model";
import { File } from "../file/file.model";
@modelOptions({
	schemaOptions:{
		versionKey:false,
		timestamps:{
			createdAt:true,
			updatedAt:true
		}
	},
})
export class Artical{
	@prop()
	title:string
	@prop()
	content:string
	@prop()
	status:number
	@prop()
	is_hot:number
	@prop({ref:()=>File})
	cover:[Ref<File>]
	@prop({ref:()=>Category})
	category:[Ref<Category>]
	@Prop({ref:()=>User})
	user_id:Ref<User>
}
export type ArticalDocument = Artical & Document
