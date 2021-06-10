import { Global, Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { PassportModule } from "@nestjs/passport";
import { JwtStrategy } from "./jwt.strategy";

@Module({
	imports: [
		PassportModule.register({ defaultStrategy: 'jwt' }),
	],
	providers: [AuthService,JwtStrategy],
	exports:[AuthService]
})
export class AuthModule {
}
