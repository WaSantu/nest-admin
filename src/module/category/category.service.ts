import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "nestjs-typegoose";
import { Category, CategoryDocument } from "../../core/dbsupport/model/category/category.model";
import { ModelType } from "@typegoose/typegoose/lib/types";
import { CreateDto, GetListDto } from "./category-dto";
import { mongoose } from "@typegoose/typegoose";

@Injectable()
export class CategoryService {
	constructor(
	  @InjectModel(Category) private readonly category: ModelType<CategoryDocument>,
	) {
	}

	/**
	 * @description 创建与编辑分类
	 * @param request
	 */
	async editCategory(request: CreateDto) {
		let query = {
			_id: request.id,
		};
		if (!request.id) {
			let re = await this.category.findOne({ name: request.name }).exec();
			if (re && re.name == request.name) {
				throw new BadRequestException("分类名称已存在");
			}
			query = { _id: new mongoose.mongo.ObjectID() };
		}
		return await this.category.findOneAndUpdate(query, {
			name: request.name,
			parent: request.parent,
			des: request.des,
			floor: request.floor,
			status: request.status,
			user_id: request.$$user._id,
		}, { upsert: true, new: true }).exec();
	}

	async getCategory(request: GetListDto) {
		if (!request.tree) {
			return await this.category.find({ parent: null }).populate("user_id").exec();
		} else {
			let query = {};
			if (request.floor) {
				query = { floor: { $in: request.floor } };
			}
			let categorise = await this.category.find(query).populate("user_id").exec();
			let getTree = function(treeData, parent) {
				var treeArr = [];
				for (var i = 0; i < treeData.length; i++) {
					var node = treeData[i];
					if (node.parent == parent) {
						var newNode = {
							name: node.name,
							id: node._id,
							des: node.des,
							status: node.status,
							parent: node.parent || null,
							title: node.name,
							floor: node.floor,
							user_id: node.user_id,
							children: getTree(treeData, node._id).length ? getTree(treeData, node._id) : null,
						};
						treeArr.push(newNode);
					}
				}
				return treeArr;
			};
			return getTree(categorise, null);
		}
	}

	async findPapa(id, floor) {
		let re = await this.category.findById(id);
		let realFloor = re.floor - 1;
		let parent = [re.parent]
		let realParent = []
		for (let i = 0; i < realFloor; i++) {
			let res = await this.category.findById(parent[parent.length - 1])
			parent.push(res.parent)
			realParent.push(res._id)
		}
		return realParent.reverse()
	}
}
