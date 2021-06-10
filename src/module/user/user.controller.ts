import { HttpService, UseInterceptors } from "@nestjs/common";
import { Body, Controller, HttpCode, Post, Req, Res, UseGuards, ValidationPipe } from "@nestjs/common";
import { EditDto, RegisterDto } from "./user-dto";
import { UserService } from "./user.service";
import { Observable } from "rxjs";
import cheerio from 'cheerio'
import { AuthGuard } from "@nestjs/passport";
import { AddAdminInterceptor } from "../../interceptor/admin.interceptor";

@Controller('/user')
export class UserController {
	constructor(
	    private readonly userService:UserService,
	) {}

	@Post('register')
	async register(@Body(new ValidationPipe()) req:RegisterDto){
		return await this.userService.createUser(req,'admin')
	}
	@Post('sign')
	async sign(@Body(new ValidationPipe()) req:RegisterDto){
		return await this.userService.createUser(req,'user')
	}

	@Post('login')
	@HttpCode(200)
	async login(@Body(new ValidationPipe()) req:RegisterDto,@Req() request:any){
		return await this.userService.login(req)
	}
	@Post('loginByToken')
	loginByToken(@Req() req){
		return this.userService.loginByToken(req)
	}
	@Post('delete')
	@UseGuards(AuthGuard('jwt'))
	@UseInterceptors(AddAdminInterceptor)
	deleteUser(@Body('ids') ids){
		return this.userService.delete(ids)
	}
	@Post('edit')
	@UseGuards(AuthGuard('jwt'))
	@UseInterceptors(AddAdminInterceptor)
	editUser(@Body() req:EditDto){
		return this.userService.edit(req)
	}
}
