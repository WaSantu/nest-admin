import { HttpException, Injectable } from "@nestjs/common";
import { InjectModel } from "nestjs-typegoose";
import { Artical, ArticalDocument } from "../../core/dbsupport/model/artical/artical.model";
import { ModelType } from "@typegoose/typegoose/lib/types";
import { EditDto, ListDto, Reqq } from "./artical-dto";
import { mongoose } from "@typegoose/typegoose";
import { Comment, CommentDocument } from "../../core/dbsupport/model/comment/comment.model";

@Injectable()
export class ArticalService {
	constructor(
	  @InjectModel(Artical) private readonly artical: ModelType<ArticalDocument>,
	  @InjectModel(Comment) private readonly comment: ModelType<CommentDocument>,

	) {
	}

	async edit(request: EditDto) {
		let query
		if(request._id){
			query = {_id:request._id}
		}else{
			query = {_id:mongoose.Types.ObjectId()}
		}
		return this.artical.findOneAndUpdate(query, {
			title: request.title,
			category: request.category,
			content: request.content,
			status: request.status,
			is_hot: request.is_hot,
			cover:request.cover,
			user_id: request.$$user._id,
		},{new:true,upsert:true});
	}
	async delete(ids: Array<string>) {
		let re = await this.artical.deleteMany({ _id: { '$in': ids } })
		return { code: 200 }
	}

	async admin_list(request:ListDto){
		let pagesize = request.pagesize || 10
		let query = {}
		if(request.name){
			query = {title:{$regex: request.name}}
		}
		let total = await this.artical.count()
		let skipNum = pagesize*(request.page-1)
		return await this.artical.find(query, null, { lean: true }).populate('user_id cover', {
			name: 1,
			path: 1
		}).skip(skipNum).limit(pagesize).exec()
	}

	async list(request:ListDto){
		let pagesize = 10
		let total = await this.artical.count()
		let skipNum = pagesize*(request.page - 1)
		let hot_list = await this.artical.find({status:1,is_hot:1}).populate('user_id cover',{name:1,path:1})
		let re = await this.artical.find({status:1,is_hot:0},null,{lean:true}).populate('user_id cover',{name:1,path:1}).skip(skipNum).limit(pagesize).exec()
		for(let val of re){
			val["comment_count"] = await this.comment.find({artical_id:val._id}).count()
		}
		return {
			total,
			list:re,
			hot_list
		}
	}
	async find_item(id:string){
		return this.artical.findById(id).populate('cover')
	}
	async find_single(id: string,from:string,req?:Reqq) {
		return this.artical.aggregate([{
			$match: {
				_id: mongoose.Types.ObjectId(id),
			},
		},{
			$lookup:{
				from:'users',
				localField:'user_id',
				foreignField:'_id',
				as:'user'
			},
		},{
			$lookup:{
				from:'categories',
				localField:'category',
				foreignField:'_id',
				as:'categorys'
			},
		},{
			$lookup:{
				from:'comments',
				let:{
					id:'$_id'
				},
				pipeline:[{
					$match:{
						$expr: {
							$eq: [
								"$$id",
								"$artical_id"
							]
						},
						status:true
					}
				}],
				as:'comment_arr'
			},
		}]);
	}
}
