import { IsBoolean, IsNotEmpty } from "class-validator";
import { mongoose } from "@typegoose/typegoose";


interface userInterface {
	_id: mongoose.Types.ObjectId
	name:string,
	pwd:string
}

class CreateDto {
	@IsNotEmpty({message:'请填写分类名称'})
	readonly name:string
	@IsNotEmpty({message:'请设置分类状态'})
	@IsBoolean({message:'status字段类型为boolean'})
	readonly status:boolean
	readonly des:string
	readonly parent:string
	readonly floor:number
	readonly id:string | mongoose.Types.ObjectId
	readonly $$user:userInterface
}

class GetListDto {
	//是否获取树形结构
	readonly tree:number|boolean
	readonly floor:number[]
}

export  {
	CreateDto,
	GetListDto
}
