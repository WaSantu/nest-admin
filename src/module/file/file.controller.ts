import { Body, Post, Req, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from "@nestjs/common";
import { Controller } from '@nestjs/common';
import { FileService } from "./file.service";
import { AuthGuard } from "@nestjs/passport";
import { AddAdminInterceptor } from "src/interceptor/admin.interceptor";
import { FileInterceptor } from "@nestjs/platform-express";

@Controller('file')
export class FileController {
	constructor(
	    private readonly fileservice:FileService
	) {
	}
	@Post('/upload')
	@UseGuards(AuthGuard('jwt'))
	@UseInterceptors(FileInterceptor('file'))
	@UseInterceptors(AddAdminInterceptor)
	upload(@UploadedFile() file,@Req() req){
		return this.fileservice.upload(file,req.user)
	}

	@Post('/delete')
	@UseGuards(AuthGuard('jwt'))
	@UseInterceptors(AddAdminInterceptor)
	delete(@Body('ids') ids){
		return this.fileservice.delete(ids)
	}

	@Post('/list')
	@UseGuards(AuthGuard('jwt'))
	@UseInterceptors(AddAdminInterceptor)
	list(@Body() request){
		return this.fileservice.list(request)
	}
}
