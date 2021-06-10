import { modelOptions, prop } from "@typegoose/typegoose";
import {Document} from "mongoose";
@modelOptions({
	schemaOptions:{
		versionKey:false,
		timestamps:{
			createdAt:true,
			updatedAt:true
		}
	},
})
export class User{
	@prop()
	name:string
	@prop()
	pwd:string
	@prop()
	salt:string
	@prop()
	role:string
	@prop()
	nickname:string
	@prop()
	mail:string
	@prop({default:true})
	status:boolean
}
export type UserDocument = User & Document
