import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { Observable, Subject } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { AppService } from '../services/app.service';


@Injectable({
  providedIn: 'root'
})
export class IsLoggedGuard implements CanActivate {
  isLoggedIn: any;
  authRequest: any = [];
  maintenanceMode: any;
  userRole: any;

  constructor(
    private authApi: AuthService,
    private toastService: HotToastService,
    private appApi: AppService
  ){}
  canActivate(
    _next: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot): Observable<boolean | UrlTree> | Subject<any> | Promise<boolean | UrlTree> | boolean | UrlTree {
      let subject = new Subject();
      this.authRequest[0] = window.localStorage.getItem('jwt');
      this.authRequest[1] = window.localStorage.getItem('loggedUsername');
      this.appApi.getAppSettings().subscribe(res => {
        this.maintenanceMode = res[0]['setting_value'];
        this.authApi.authenticateUser(this.authRequest).subscribe(res => {
          this.isLoggedIn = res;
          if(this.isLoggedIn == true){
            this.authApi.getMyRole(this.authRequest).subscribe(res => {
              this.userRole = res.role;
              if(this.userRole == 'admin' || this.userRole == 'super-admin' || this.maintenanceMode == 'false'){
                subject.next(this.isLoggedIn);
              }else{
                this.isLoggedIn = false;
                this.toastService.error("AWE is unavailable at this time. Please try again later.");
                window.localStorage.removeItem('jwt');
                window.localStorage.removeItem('loggedUsername');
                subject.next(this.isLoggedIn);
                setTimeout(() => window.location.href = './', 2500);
              }
            }, err => {
              console.log(err);
            })
          }
          else{
              // Kick user to homepage if not logged in
              this.isLoggedIn = false;
              this.toastService.error("You must be logged in to use AWE");
              subject.next(this.isLoggedIn);
              setTimeout(() => window.location.href = './', 1500);
          }
        }, err =>{
          console.log(err);
        });
      }, err => {
        console.log(err);
      });
      return subject;
  }
}
