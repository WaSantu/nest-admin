import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AddUserInterceptor implements NestInterceptor {
	// @ts-ignore
	intercept(
	  context: ExecutionContext,
	  next: CallHandler,
	): Observable<any> {
		const req = context.switchToHttp().getRequest();
		req.body.$$user = req.user;
		return next.handle()
	}
}