import { Global, Module } from "@nestjs/common";
import { TypegooseModule } from "nestjs-typegoose";
import { DbsupportService } from "./dbsupport.service";
import { User } from "./model/user/user.model";
import { Category } from "./model/category/category.model";
import { BabyBug } from "./model/babybug/babybug";
import { BabyComment } from "./model/babybug/babycomment";
import { Artical } from "./model/artical/artical.model";
import { Comment } from "./model/comment/comment.model";
import { File } from "./model/file/file.model";
const models = TypegooseModule.forFeature([User,Category,Artical,Comment,File,BabyBug,BabyComment])
@Global()
@Module({
	imports: [
		TypegooseModule.forRoot("mongodb://localhost/nest", {
			useCreateIndex: true,
			useFindAndModify: true,
			useNewUrlParser: true,
			useUnifiedTopology: true,
		}),
		models
	],
	providers: [DbsupportService],
	exports:[DbsupportService,models]
})
export class DbsupportModule {
}
