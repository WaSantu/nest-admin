import { Injectable } from "@nestjs/common";
import * as md5 from "md5";
import { join } from "path";
import { InjectModel } from "nestjs-typegoose";
import { ModelType } from "@typegoose/typegoose/lib/types";
import { File, FileDocument } from "../../core/dbsupport/model/file/file.model";
import * as moment from "moment";
import * as fs from "fs";
import { createWriteStream } from "fs";

@Injectable()
export class FileService {
	public imgType:Array<string> = ['image/gif','image/png','image/jpg','image/jpeg']
	constructor(
	  @InjectModel(File) private readonly file:ModelType<FileDocument>
	) {
	}
	async upload(file: Express.Multer.File,user) {
		let fileMd5 = md5(file.buffer)
		let is_exits = await this.file.findOne({ md5: fileMd5 })
		if(is_exits){
			return is_exits
		}
		let targetDir
		let fileType
		if(this.imgType.indexOf(file.mimetype) != -1){
			targetDir = 'img'
			fileType=0
		}else{
			targetDir = 'media'
			fileType=1
		}
		let time = moment().format('YYYY-MM-DD')
		let wrapperPath = join(__dirname,'../../',`upload`,targetDir)
		if(!fs.existsSync(wrapperPath)){
			fs.mkdirSync(wrapperPath)
		}
		let dirPath = join(__dirname,'../../',`upload`,targetDir,time)
		let checkDir = fs.existsSync(dirPath)
		if(!checkDir){
			fs.mkdirSync(dirPath)
		}
		let writeFile = createWriteStream(`${dirPath}\\${file.originalname}`)
		writeFile.write(file.buffer)
		const publicPath = `/static/${targetDir}/${time}`
		const realPath = `${dirPath}\\${file.originalname}`
		return await this.file.create({
			name: file.originalname,
			fileType:fileType,
			path: `${publicPath}/${file.originalname}`,
			realPath : realPath,
			md5: fileMd5,
			user_id: user.id
		})
	}

	async delete(ids) {
		let filePathes = await this.file.find({_id:{$in:ids}})
		for(let val of filePathes){
			fs.unlinkSync(val.realPath)
		}
		return this.file.deleteMany({_id:{$in:ids}})
	}

	async list(request){
		let query = {}
		if(request.keywords){
			Object.assign(query,{name:{$regex:request.keywords}})
		}
		if(request.type || request.type === 0){
			Object.assign(query,{fileType:request.type})
		}
		let total = await this.file.find(query).count()
		let pagesize = 12
		let skipNum = pagesize * (request.page - 1)
		let list = await this.file.find(query).sort({_id:-1}).skip(skipNum).limit(pagesize)
		return {
			list,
			total
		}
	}
}
