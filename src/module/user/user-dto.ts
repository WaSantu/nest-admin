import { IsNotEmpty, IsString } from "class-validator";

class RegisterDto {
	@IsNotEmpty({message:'请填写账号名'})
	readonly name:string
	@IsNotEmpty({message:'请填写密码'})
	readonly pwd:string
	readonly nickname:string
	readonly mail:string
	readonly id:string
}

class EditDto {
	readonly name:string
	readonly nickname:string
	readonly mail:string
	readonly id:string
}

export  {
	RegisterDto,
	EditDto
}
