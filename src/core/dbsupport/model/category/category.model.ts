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
export class Category{
	@prop()
	name:string
	@Prop()
	parent:string
	@Prop()
	des:string
	@Prop()
	status:boolean
	@Prop()
	floor:number
	@Prop({ref:()=>User})
	user_id:Ref<User>
}
export type CategoryDocument = Category & Document