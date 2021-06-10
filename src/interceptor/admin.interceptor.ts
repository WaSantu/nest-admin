import { CallHandler, ExecutionContext, HttpException, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable } from 'rxjs';

@Injectable()
export class AddAdminInterceptor implements NestInterceptor {
	// @ts-ignore
	intercept(
	  context: ExecutionContext,
	  next: CallHandler,
	): Observable<any> {
		const req = context.switchToHttp().getRequest();
		if(req.user.role != 'admin'){
			throw new HttpException('error',401)
		}
		req.body.$$user = req.user;
		return next.handle()
	}
}