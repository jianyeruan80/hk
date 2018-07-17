import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor,HttpHeaders, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable,fromEvent,timer, Subject, throwError,forkJoin,of} from 'rxjs';
import { map, takeUntil, tap,catchError,finalize,debounceTime, timeout } from 'rxjs/operators';

import { MyService } from './my.service';
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  	constructor(public myService:MyService) { }
  intercept (req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
   let token=this.myService["user"]?this.myService["user"]["token"]:"";
   
			   if(req["url"].indexOf("/upload")>=0){
					   	const headers = new HttpHeaders({
					      'Authorization': 'Bearer '+token
					      
					     });
						const authReq = req.clone({headers});
					    return next.handle(authReq);//.timeout(10000);
			   }else{
				   const headers = new HttpHeaders({
				      'Authorization': 'Bearer '+token,
				      'Content-Type': 'application/json'
				      
				    });
					const authReq = req.clone({headers});
				    return next.handle(authReq);//.timeout(10000);
			}
 }
}