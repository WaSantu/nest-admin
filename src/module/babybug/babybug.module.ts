import { Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/common";
import { BabybugController } from './babybug.controller';
import { BabybugService } from './babybug.service';
@Module({
	imports:[
		HttpModule
	],
	controllers:[BabybugController],
	providers:[BabybugService],
})
export class BabybugModule {}
