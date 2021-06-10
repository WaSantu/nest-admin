import { Body, Controller, Post, Req, UseGuards, UseInterceptors, ValidationPipe } from "@nestjs/common";
import { CreateDto, GetListDto } from "./category-dto";
import { CategoryService } from "./category.service";
import { AuthGuard } from "@nestjs/passport";
import { AddUserInterceptor } from "../../interceptor/user.interceptor";

@Controller('category')
export class CategoryController {

	constructor(
	  private readonly categoryService:CategoryService
	) {
	}

	@Post('/edit')
	@UseGuards(AuthGuard('jwt'))
	@UseInterceptors(AddUserInterceptor)
	async editCategory(@Body(new ValidationPipe()) request:CreateDto){
		return await this.categoryService.editCategory(request)
	}

	@Post('/tree')
	@UseGuards(AuthGuard('jwt'))
	async getCategory(@Body() request:GetListDto){
		return this.categoryService.getCategory(request)
	}
}