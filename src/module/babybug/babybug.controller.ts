import { Post, Res } from "@nestjs/common";
import { Body } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { BabybugService } from "./babybug.service";

@Controller('babybug')
export class BabybugController {
	constructor(
	  private readonly babybugservice:BabybugService
	) {
	}
	@Post('/run')
	runBug(@Body('id') id ,@Res() res){
		try {
			return this.babybugservice.run(id)
		}catch (e) {
			res.json({
				error:e
			})
		}
	}
	@Post('/test')
	test(@Res() res){
		return {
			data:'ok'
		}
	}
}
