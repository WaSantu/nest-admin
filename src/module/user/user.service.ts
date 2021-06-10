import { BadRequestException, HttpException, HttpService, Injectable } from "@nestjs/common";
import { InjectModel } from "nestjs-typegoose";
import { User, UserDocument } from "../../core/dbsupport/model/user/user.model";
import { EditDto, RegisterDto } from "./user-dto";
import { encryptPwd, initSalt } from "../../utils/salt-password";
import { ModelType } from "@typegoose/typegoose/lib/types";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class UserService {
	constructor(
	  @InjectModel(User) private readonly userModel: ModelType<UserDocument>,
	  private readonly jwtService: JwtService,
	  private readonly httpService: HttpService,
	) {
	}

	async createUser(req: RegisterDto,role:string) {
		let userInfo = await this.userModel.findOne({$or:[{ name: req.name },{nickname:req.nickname}]});
		if (userInfo) {
			throw new BadRequestException("用户名或昵称已存在");
		}
		let salt = initSalt();
		let saltPassword = encryptPwd(req.pwd, salt);
		let re = await this.userModel.create({
			name: req.name,
			pwd: saltPassword,
			salt: salt,
			role:role,
			nickname:req.nickname,
			mail:req.mail
		});
		let payload = re.toObject();
		payload.pwd = req.pwd;
		delete payload.salt;
		let token = this.jwtService.sign(payload);
		return {
			code: 200,
			token: token,
			data: payload,
		};
	}

	async login(req: RegisterDto, auto?: boolean) {
		let re = await this.userModel.findOne({ name: req.name }).exec();
		if (!re) {
			throw new BadRequestException("用户不存在哦");
		}
		let realPwd = encryptPwd(req.pwd, re.salt);
		if (realPwd != re.pwd) {
			throw new BadRequestException("密码错误");
		}
		let payload = re.toObject();
		payload.pwd = req.pwd;
		delete payload.salt;
		let token = !auto ? this.jwtService.sign(payload) : false;
		return {
			code: 200,
			token,
			data: payload,
		};
	}

	loginByToken(req) {
		let token = req.headers.authorization.split(" ")[1];
		let encryptData;
		try {
			encryptData = this.jwtService.verify(token, {
				secret: "santa",
			});
		} catch (e) {
			throw new HttpException({ msg: "登录状态已经过期" }, 412);
		}
		let loginParams = {
			name: encryptData.name,
			pwd: encryptData.pwd,
		};
		return this.login(encryptData, true);
	}
	async delete(ids: Array<string>) {
		let re = await this.userModel.deleteMany({_id:{$in:ids}})
		return {
			code:200
		}
	}
	edit(req:EditDto){
		return this.userModel.findByIdAndUpdate(req.id, {
			name: req.name,
			nickname: req.nickname,
			mail: req.mail
		}, { new: true });
	}
}

