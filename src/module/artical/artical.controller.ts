import { Body, Controller, Post, Req, UseGuards, UseInterceptors, ValidationPipe } from "@nestjs/common";
import { ArticalService } from "./artical.service";
import { AuthGuard } from "@nestjs/passport";
import { AddUserInterceptor } from "../../interceptor/user.interceptor";
import { EditDto, ListDto } from "./artical-dto";
import { AddAdminInterceptor } from "src/interceptor/admin.interceptor";

@Controller('artical')
export class ArticalController {
	constructor(
	  private readonly articalservice:ArticalService
	) {
	}
	@Post('/edit')
	@UseGuards(AuthGuard('jwt'))
	@UseInterceptors(AddAdminInterceptor)
	edit(@Body(new ValidationPipe()) request:EditDto){
		return this.articalservice.edit(request)
	}

	@Post('/delete')
	@UseGuards(AuthGuard('jwt'))
	@UseInterceptors(AddAdminInterceptor)
	delete(@Body('ids') ids:Array<string>){
		return this.articalservice.delete(ids)
	}

	@Post('/list')
	@UseGuards(AuthGuard('jwt'))
	@UseInterceptors(AddUserInterceptor)
	list(@Body() request:ListDto){
		return this.articalservice.list(request)
	}

	@Post('/admin_artical_list')
	@UseGuards(AuthGuard('jwt'))
	@UseInterceptors(AddAdminInterceptor)
	admin_list(@Body() request:ListDto){
		return this.articalservice.admin_list(request)
	}

	@Post('/find')
	@UseGuards(AuthGuard('jwt'))
	@UseInterceptors(AddAdminInterceptor)
	find(@Body('id') id){
		return this.articalservice.find_item(id)
	}

	@Post('/item')
	item(@Body('id') id){
		return this.articalservice.find_single(id)
	}
}
