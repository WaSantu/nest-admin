import { modelOptions, Prop, prop, Ref } from "@typegoose/typegoose";
import { Document } from "mongoose";
@modelOptions({
	schemaOptions:{
		versionKey:false,
		timestamps:{
			createdAt:true,
			updatedAt:true
		}
	},
})
export class BabyBug{
	@prop()
	did:string
	@prop()
	title:string
	@prop()
	group_name:string
	@prop()
	group_number:number
	@prop()
	user_name:string
	@prop()
	content:string
	@prop()
	at:string
}
export type BabyBugDocument = BabyBug & Document