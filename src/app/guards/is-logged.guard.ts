import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { Observable, Subject } from 'rxjs';
import { AuthService } from '../services/auth.service';


@Injectable({
  providedIn: 'root'
})
export class IsLoggedGuard implements CanActivate {
  isLoggedIn: any;
  authRequest: any = [];
  constructor(
    private router: Router,
    private authApi: AuthService,
    private toastService: HotToastService
  ){}
  canActivate(
    _next: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot): Observable<boolean | UrlTree> | Subject<any> | Promise<boolean | UrlTree> | boolean | UrlTree {
      let subject = new Subject();
      this.authRequest[0] = window.localStorage.getItem('jwt');
      this.authRequest[1] = window.localStorage.getItem('loggedUsername');
      this.authApi.authenticateUser(this.authRequest).subscribe(res => {
        this.isLoggedIn = res;
        if(this.isLoggedIn == true){
          subject.next(this.isLoggedIn);
        }
        else{
            this.isLoggedIn = false;
            this.toastService.error("You must be logged in to use AWE");
            subject.next(this.isLoggedIn);
            this.router.navigate(['']);
        }
      }, err =>{
        console.log(err);
      });
      return subject;
  }
}
