import { BadRequestException, HttpException, HttpService, Injectable } from "@nestjs/common";
import { InjectModel } from "nestjs-typegoose";
import { ModelType } from "@typegoose/typegoose/lib/types";
import { BabyBug, BabyBugDocument } from "../../core/dbsupport/model/babybug/babybug";
import cheerio from "cheerio";
import { BabyComment, BabyCommentDocument } from "../../core/dbsupport/model/babybug/babycomment";

@Injectable()
export class BabybugService {
	private id;

	constructor(
	  @InjectModel(BabyBug) private readonly babyModel: ModelType<BabyBugDocument>,
	  @InjectModel(BabyComment) private readonly babyComemntModel: ModelType<BabyCommentDocument>,
	  private readonly httpserver: HttpService,
	) {

	}

	async run(id: string) {
		this.id = id;
		return this._startRun();
	}

	async _startRun() {
		let url = `https://www.douban.com/group/topic/${this.id}`;
		let re = await this.httpserver.request({
			url:url,
			method:'GET',
			headers:{
				"Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
				"Accept-Encoding": "gzip, deflate, br",
				"Accept-Language": "zh-CN,zh;q=0.9",
				"Cache-Control": "max-age=0",
				"Connection": "keep-alive",
				"Host": "www.douban.com",
				"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36",
			},
		}).toPromise()
		// try {
		// 	re = await this.httpserver.get(url).toPromise();
		// } catch (e) {
		// 	throw new HttpException({ msg: "fail" }, 412);
		// }
		if (!re.data) {
			throw new HttpException({ msg: "fail" }, 412);
		}
		let $ = cheerio.load(re.data);
		return;
		let baby = {
			did:this.id,
			title: $(".article>h1").text().trim(),
			group_name: $(".group-item .title").text().trim(),
			group_number: $(".ft-members>i").text().trim(),
			user_name: $(".topic-doc>h3 .from").text().split(":")[1].trim(),
			at: $(".topic-doc>h3 .create-time").text().trim(),
			content: $("#link-report").text().trim(),
		};
		let main_save = await this.babyModel.create(baby);

		let comment_url = [`https://www.douban.com/group/topic/${this.id}`];
		let comment = $(".paginator").children("a[href]");
		for (let val of comment) {
			comment_url.push($(val).attr("href"));
		}
		$ = null;
		comment_url = [...new Set(comment_url)];
		let comment_save_list = [];
		for (let val of comment_url) {
			let { data } = await this.httpserver.get(val).toPromise();
			let $ = cheerio.load(data);
			let comment_item = $(".comment-item");
			for (let val of comment_item) {
				let comment_obj = {
					user_name: $(val).children(".reply-doc.content").children(".bg-img-green").children("h4").children("a").text().trim(),
					content: $(val).children(".reply-doc.content").children(".reply-content").text().trim(),
					at: $(val).children(".reply-doc.content").children(".bg-img-green").children("h4").children("span").text().trim(),
					babybug_id: main_save._id,
				};
				comment_save_list.push(comment_obj);
			}
		}
		let res = await this.babyComemntModel.insertMany(comment_save_list);
		return {
			msg: "ok",
		};
	}
}
