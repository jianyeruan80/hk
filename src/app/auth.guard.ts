import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable,fromEvent,timer, Subject, throwError,forkJoin,of} from 'rxjs';
import { map, takeUntil, tap,catchError,finalize,debounceTime, timeout } from 'rxjs/operators';
import { MyService } from './my.service';
import {Router,ActivatedRoute}  from '@angular/router';
@Injectable()
export class AuthGuard implements CanActivate {
   filterUrlList=[]; 
   constructor(private router:Router,public myService:MyService,public aRoute:ActivatedRoute) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    
    return this.checkLogin(state["url"],next["queryParams"]["url"]);
   }
   checkLogin(url,arg):boolean{
	if(this.myService["user"]["token"]){
    
		return true;
	}else{
       
       /*if(url.indexOf("/index/")!=-1){
         
         this.router.navigate(["/"+arg+"/admin"]);
       }else{*/
         this.router.navigate(['/home']); 
    		
	}

  }
}
