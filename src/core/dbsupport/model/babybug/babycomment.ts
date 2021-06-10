import { modelOptions, Prop, prop, Ref } from "@typegoose/typegoose";
import { Document } from "mongoose";
import { BabyBug } from "./babybug";
@modelOptions({
	schemaOptions:{
		versionKey:false,
		timestamps:{
			createdAt:true,
			updatedAt:true
		}
	},
})
export class BabyComment {
	@prop()
	user_name:string
	@prop()
	content:string
	@prop()
	at:string
	@prop({ref:()=>BabyBug})
	babybug_id:Ref<BabyBug>
}
export type BabyCommentDocument = BabyComment & Document