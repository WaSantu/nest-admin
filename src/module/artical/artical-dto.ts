import { IsBoolean, IsNotEmpty } from "class-validator";
import { mongoose } from "@typegoose/typegoose";


interface userInterface {
	_id: mongoose.Types.ObjectId
	name:string,
	pwd:string
}

class EditDto {
	readonly _id:string
	@IsNotEmpty({message:'请填写文章名称'})
	readonly title:string
	readonly category:Array<mongoose.Types.ObjectId>
	readonly status:number
	readonly is_hot:number
	readonly content:string
	readonly $$user:userInterface
	readonly cover:mongoose.Types.ObjectId[]
}

class ListDto {
	readonly status?:number
	readonly page:number
	readonly pagesize?:number
	readonly name?:string
	// readonly query
}

class Reqq {
	readonly $$user
}

export  {
	EditDto,
	ListDto,
	Reqq
}
