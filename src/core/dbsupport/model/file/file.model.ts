import { modelOptions, Prop, prop, Ref } from "@typegoose/typegoose";
import { Document } from "mongoose";
import { User } from "../user/user.model";
@modelOptions({
	schemaOptions:{
		versionKey:false,
		timestamps:{
			createdAt:true,
			updatedAt:true
		}
	},
})
export class File{
	@prop()
	name:string
	@prop()
	md5:string
	@prop()
	path:string
	@prop({ref:()=>User})
	user_id:Ref<User>
}
export type FileDocument = File & Document