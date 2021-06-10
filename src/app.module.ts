import { MiddlewareConsumer, Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { DbsupportModule } from "./core/dbsupport/dbsupport.module";
import { UserModule } from './module/user/user.module';
import { AuthModule } from "./core/auth/auth.module";
import { CategoryModule } from './module/category/category.module';
import { logger } from "./utils/logger.middleware";
import { CategoryController } from "./module/category/category.controller";
import { BabybugModule } from "./module/babybug/babybug.module";
import { ArticalModule } from './module/artical/artical.module';
import { CommentModule } from './module/comment/comment.module';
import { FileModule } from './module/file/file.module';

@Module({
	imports: [
		DbsupportModule,
		UserModule,
	    AuthModule,
	    CategoryModule,
	    BabybugModule,
	    ArticalModule,
	    CommentModule,
	    FileModule
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {

}
