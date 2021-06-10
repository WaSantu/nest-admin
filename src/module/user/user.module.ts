import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { AuthModule } from "../../core/auth/auth.module";
import { UserController } from "./user.controller";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { HttpModule } from "@nestjs/common";
@Module({
	imports:[
		JwtModule.register({
			secret: 'santa',
			signOptions: { expiresIn: '8h' }, // token 过期时效
		}),
		HttpModule
	],
	controllers:[UserController],
	providers:[UserService],
	exports:[UserService]
})
export class UserModule {}
