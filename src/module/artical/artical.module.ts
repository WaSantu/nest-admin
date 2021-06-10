import { Module } from '@nestjs/common';
import { ArticalController } from './artical.controller';
import { ArticalService } from './artical.service';

@Module({
  controllers: [ArticalController],
  providers: [ArticalService]
})
export class ArticalModule {}
